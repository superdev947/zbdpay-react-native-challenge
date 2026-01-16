import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  title: string;
  prices: [number, number][];
  subtitle?: string;
  color?: string;
};

export function PriceChart({ title, prices, subtitle, color = '#22c55e' }: Props) {
  const { width } = useWindowDimensions();
  const isDark = useColorScheme() === 'dark';

  const chartWidth = Math.max(0, width - 32);
  const chartHeight = 200;
  const padding = 16;

  const plotW = Math.max(0, chartWidth - padding * 2);
  const plotH = Math.max(0, chartHeight - padding * 2);

  const progress = useSharedValue(0);
  const pathLengthSV = useSharedValue(0);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<any>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const theme = useMemo(() => {
    return {
      surface: isDark ? '#0b0f19' : '#ffffff',
      border: isDark ? '#1f2937' : '#e4e4e7',
      muted: isDark ? '#a1a1aa' : '#52525b',
      text: isDark ? '#f4f4f5' : '#0f172a',
      tooltipBg: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.97)',
      tooltipBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      crosshair: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)',
      pos: color,
      neg: '#ef4444',
    };
  }, [isDark, color]);

  const {
    path,
    gradientPath,
    minPrice,
    maxPrice,
    priceChange,
    priceChangePercent,
    hasData,
    points,
  } = useMemo(() => {
    if (!prices || prices.length === 0 || chartWidth <= 0) {
      return {
        path: '',
        gradientPath: '',
        minPrice: 0,
        maxPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        hasData: false,
        points: [] as { x: number; y: number; price: number; ts: number }[],
      };
    }

    const priceValues = prices.map((p) => p[1]);
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);
    const range = max - min || 1;

    const firstPrice = priceValues[0] ?? min;
    const lastPrice = priceValues[priceValues.length - 1] ?? min;
    const change = lastPrice - firstPrice;
    const changePercent = firstPrice === 0 ? 0 : (change / firstPrice) * 100;

    if (prices.length === 1) {
      const x1 = padding;
      const x2 = padding + plotW;
      const y = chartHeight - padding - ((priceValues[0] - min) / range) * plotH;

      const linePath = `M ${x1} ${y} L ${x2} ${y}`;
      const gradPath = `${linePath} L ${x2} ${chartHeight - padding} L ${x1} ${chartHeight - padding} Z`;

      const pts = [
        {
          x: x1,
          y,
          price: priceValues[0],
          ts: prices[0][0],
        },
      ];

      return {
        path: linePath,
        gradientPath: gradPath,
        minPrice: min,
        maxPrice: max,
        priceChange: change,
        priceChangePercent: changePercent,
        hasData: true,
        points: pts,
      };
    }

    const pts = prices.map(([ts, price], index) => {
      const t = index / (prices.length - 1);
      const x = t * plotW + padding;
      const y = chartHeight - padding - ((price - min) / range) * plotH;
      return { x, y, price, ts };
    });

    const linePath = pts.reduce(
      (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
      '',
    );
    const gradPath = `${linePath} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

    return {
      path: linePath,
      gradientPath: gradPath,
      minPrice: min,
      maxPrice: max,
      priceChange: change,
      priceChangePercent: changePercent,
      hasData: true,
      points: pts,
    };
  }, [prices, chartWidth, chartHeight, padding, plotW, plotH]);

  const isPositive = priceChange >= 0;
  const displayColor = isPositive ? theme.pos : theme.neg;

  useEffect(() => {
    if (!path) {
      pathLengthSV.value = 0;
      setPathLength(0);
      return;
    }

    const id = requestAnimationFrame(() => {
      try {
        const L = Number(pathRef.current?.getTotalLength?.() ?? 0);
        pathLengthSV.value = L;
        setPathLength(L);
      } catch {
        const fallback = 2000;
        pathLengthSV.value = fallback;
        setPathLength(fallback);
      }
    });

    return () => cancelAnimationFrame(id);
  }, [path, pathLengthSV]);

  useEffect(() => {
    if (!hasData) return;
    progress.value = 0;
    progress.value = withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) });

    setSelectedIndex(null);
  }, [prices, hasData, progress]);

  const animatedProps = useAnimatedProps(() => {
    const L = pathLengthSV.value || 0;
    return { strokeDashoffset: (1 - progress.value) * L };
  });

  const onChartPress = useCallback(
    (evt: any) => {
      if (!hasData || points.length === 0) return;

      const x = evt?.nativeEvent?.locationX ?? 0;

      const clamped = Math.min(padding + plotW, Math.max(padding, x));

      const t = plotW > 0 ? (clamped - padding) / plotW : 0;
      const idx = Math.round(t * (points.length - 1));

      setSelectedIndex(idx);
    },
    [hasData, points.length, padding, plotW],
  );

  const clearTooltip = useCallback(() => setSelectedIndex(null), []);

  if (!hasData) {
    return (
      <View className="p-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl my-2">
        <Text className="text-lg font-semibold text-black dark:text-white">{title}</Text>
        <View className="h-48 justify-center items-center bg-zinc-100 dark:bg-gray-800 rounded-lg mt-3">
          <Text className="text-zinc-500 dark:text-gray-500 text-sm">
            No data available
          </Text>
        </View>
      </View>
    );
  }

  const sel = selectedIndex !== null ? points[selectedIndex] : null;

  const label = sel ? `$${sel.price.toFixed(2)}` : '';

  const labelW = Math.max(54, Math.min(120, 10 + label.length * 8));
  const labelH = 26;

  const tipX = sel
    ? Math.min(chartWidth - padding - labelW, Math.max(padding, sel.x - labelW / 2))
    : 0;
  const tipY = padding;

  return (
    <View className="p-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl my-2">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-lg font-semibold text-black dark:text-white">{title}</Text>

        <View className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-gray-800">
          <Text className="text-sm font-semibold" style={{ color: displayColor }}>
            {isPositive ? '+' : ''}
            {priceChangePercent.toFixed(2)}%
          </Text>
        </View>
      </View>

      {subtitle ? (
        <Text className="text-xs text-zinc-600 dark:text-gray-400 mb-4">{subtitle}</Text>
      ) : null}

      <View className="my-2" style={{ width: chartWidth, alignSelf: 'center' }}>
        <View style={{ position: 'relative', width: chartWidth, height: chartHeight }}>
          <Svg width={chartWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={displayColor} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={displayColor} stopOpacity="0" />
              </LinearGradient>
            </Defs>

            <Path d={gradientPath} fill="url(#gradient)" />

            <AnimatedPath
              ref={pathRef}
              d={path}
              stroke={displayColor}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLength > 0 ? String(pathLength) : undefined}
              animatedProps={animatedProps}
            />

            {sel ? (
              <G>
                <Line
                  x1={sel.x}
                  y1={padding}
                  x2={sel.x}
                  y2={chartHeight - padding}
                  stroke={theme.crosshair}
                  strokeWidth={1}
                />

                <Circle cx={sel.x} cy={sel.y} r={4} fill={displayColor} />
                <Circle cx={sel.x} cy={sel.y} r={7} fill={displayColor} opacity={0.18} />

                <Rect
                  x={tipX}
                  y={tipY}
                  width={labelW}
                  height={labelH}
                  rx={8}
                  ry={8}
                  fill={theme.tooltipBg}
                  stroke={theme.tooltipBorder}
                  strokeWidth={1}
                />
                <SvgText
                  x={tipX + labelW / 2}
                  y={tipY + 18}
                  fontSize={12}
                  fontWeight="600"
                  fill={theme.text}
                  textAnchor="middle">
                  {label}
                </SvgText>
              </G>
            ) : null}
          </Svg>

          <Pressable
            onPress={onChartPress}
            onLongPress={clearTooltip}
            style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
            accessibilityRole="button"
            accessibilityLabel="Chart"
          />
        </View>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-zinc-600 dark:text-gray-400">
          Low: ${minPrice.toFixed(2)}
        </Text>
        <Text className="text-xs text-zinc-600 dark:text-gray-400">
          High: ${maxPrice.toFixed(2)}
        </Text>
      </View>

      {sel ? (
        <Text className="text-xs mt-2" style={{ color: theme.muted }}>
          Selected: {label}
        </Text>
      ) : null}
    </View>
  );
}
