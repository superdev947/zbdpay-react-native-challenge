import { Feather } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { MoneyInput } from './MoneyInput';

import type { CoinId } from '@/constants/coins';
import { useAlertsStore } from '@/store/alertsStore';
import type { AlertDirection, PriceAlert } from '@/types/alerts';
import { parseMoney } from '@/utils/format';
import { AlertRow } from './AlertRow';
import { CardHeader } from './CardHeader';
import { DirectionPillToggle } from './DirectionPillToggle';
import { PrimaryButton } from './PrimaryButton';

const EMPTY_ALERTS: PriceAlert[] = [];

function isSameUsd(a: number, b: number) {
  return Math.abs(a - b) < 0.000001;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface PriceAlertCardProps {
  coinId: CoinId;
  coinMeta: { name: string; symbol: string };
}

export function PriceAlertCard({ coinId, coinMeta }: PriceAlertCardProps) {
  const upsertAlert = useAlertsStore((s) => s.upsertAlert);
  const removeAlert = useAlertsStore((s) => s.removeAlert);

  const coinAlerts = useAlertsStore((s) => s.activeAlerts[coinId]);
  const activeAlerts = coinAlerts ?? EMPTY_ALERTS;

  const [editingId, setEditingId] = useState<string | null>(null);

  const editingAlert = useMemo(
    () => (editingId ? activeAlerts.find((a) => a.id === editingId) : undefined),
    [activeAlerts, editingId],
  );

  const [direction, setDirection] = useState<AlertDirection>('above');
  const [target, setTarget] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const isEditing = Boolean(editingId);

  const existingSameDirection = useMemo(() => {
    return activeAlerts.find((a) => a.direction === direction);
  }, [activeAlerts, direction]);

  function resetForm() {
    setDirection('above');
    setTarget('');
    setTouched(false);
  }

  function onCancelEdit() {
    setEditingId(null);
    resetForm();
  }

  useEffect(() => {
    setEditingId(null);
    resetForm();
  }, [coinId]);

  useEffect(() => {
    if (!editingAlert) return;
    setDirection(editingAlert.direction);
    setTarget(String(editingAlert.targetUsd));
    setTouched(false);
  }, [editingAlert]);

  const parsedTarget = parseMoney(target);

  const targetError = !touched
    ? null
    : !Number.isFinite(parsedTarget) || parsedTarget <= 0
      ? 'Enter a valid USD target price.'
      : null;

  const isValid = Number.isFinite(parsedTarget) && parsedTarget > 0;

  const isDuplicate = useMemo(() => {
    if (!isValid) return false;

    return activeAlerts.some((a) => {
      const sameRule = a.direction === direction && isSameUsd(a.targetUsd, parsedTarget);
      const notSelf = !editingId || a.id !== editingId;
      return sameRule && notSelf;
    });
  }, [activeAlerts, direction, parsedTarget, isValid, editingId]);

  const canSave = isValid && !isDuplicate;

  function onSaveOrUpdate() {
    setTouched(true);
    if (!isValid) return;

    if (isDuplicate) {
      Alert.alert('Duplicate', 'You already have an alert with the same target.');
      return;
    }

    const idToUse = editingId ?? makeId();

    const willReplace =
      !isEditing &&
      Boolean(existingSameDirection && existingSameDirection.id !== idToUse);

    const alert: PriceAlert = {
      id: idToUse,
      coinId,
      direction,
      targetUsd: parsedTarget,
      createdAtUtc: editingAlert?.createdAtUtc ?? new Date().toISOString(),
    };

    upsertAlert(alert);

    const dirLabel = direction.toUpperCase();

    Alert.alert(
      'Success',
      willReplace
        ? `Replaced existing ${dirLabel} alert.`
        : isEditing
          ? 'Alert updated successfully!'
          : 'Alert created successfully!',
    );

    onCancelEdit();
  }

  const subtitle = `${coinMeta.name} • ${coinMeta.symbol.toUpperCase()}`;

  return (
    <View className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
      <CardHeader
        title="Price Alerts"
        subtitle={subtitle}
        isEditing={isEditing}
        onCancelEdit={onCancelEdit}
      />

      {/* Active alerts list */}
      {activeAlerts.length ? (
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-zinc-700 dark:text-zinc-300 font-semibold">
              Active ({activeAlerts.length})
            </Text>
            <View className="flex-row items-center">
              <Feather name="info" size={14} color="#71717a" />
              <Text className="text-zinc-500 dark:text-zinc-400 text-xs ml-2">
                Each triggers once, then moves to log
              </Text>
            </View>
          </View>

          {activeAlerts.map((a) => {
            const rowIsEditing = a.id === editingId;

            return (
              <AlertRow
                key={a.id}
                alert={a}
                isEditingRow={rowIsEditing}
                onEdit={() => setEditingId(a.id)}
                onDelete={() =>
                  Alert.alert(
                    'Delete Alert',
                    'Are you sure you want to delete this alert?',
                    [
                      { text: 'No', style: 'cancel' },
                      {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: () => {
                          if (rowIsEditing) onCancelEdit();
                          removeAlert(coinId, a.id);
                        },
                      },
                    ],
                  )
                }
              />
            );
          })}
        </View>
      ) : (
        <View className="bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-4">
          <View className="flex-row items-start">
            <View className="w-9 h-9 rounded-full bg-white/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-700 items-center justify-center mr-3">
              <Feather name="plus-circle" size={18} color="#52525b" />
            </View>
            <Text className="text-zinc-600 dark:text-zinc-400 flex-1">
              No active alerts yet. Create one below. Each alert triggers once and moves
              to the Alerts log.
            </Text>
          </View>
        </View>
      )}

      {/* Direction control */}
      <DirectionPillToggle
        value={direction}
        onChange={(d) => {
          setDirection(d);
          setTouched(true);
        }}
      />

      <MoneyInput
        value={target}
        onChange={(v) => {
          setTarget(v);
          setTouched(true);
        }}
        label="Target price (USD)"
        placeholder={coinId === 'bitcoin' ? '70000' : '100'}
        error={targetError ?? (isDuplicate ? 'Duplicate alert for this target.' : null)}
        helperText="Tip: Use round numbers. Alerts can trigger quickly during volatility."
      />

      <PrimaryButton
        label={isEditing ? 'Update Alert' : 'Save Alert'}
        disabled={!canSave}
        onPress={onSaveOrUpdate}
      />
    </View>
  );
}
