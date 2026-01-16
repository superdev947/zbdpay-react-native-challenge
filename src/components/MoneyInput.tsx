import React from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  error?: string | null;
  helperText?: string;
};

export function MoneyInput({
  value,
  onChange,
  placeholder,
  label,
  error,
  helperText,
}: Props) {
  function handleChange(text: string) {
    const withDot = text.replace(/,/g, '.');
    const cleaned = withDot.replace(/[^\d.\-eE]/g, '');
    onChange(cleaned);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      {label ? (
        <Text className="text-zinc-700 dark:text-zinc-300 font-medium mb-2">{label}</Text>
      ) : null}
      <View
        className={[
          'flex-row items-center bg-white dark:bg-zinc-900 rounded-xl px-3 py-2 border',
          error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-800',
        ].join(' ')}>
        <Text className="text-zinc-600 dark:text-zinc-400 mr-2">$</Text>
        <TextInput
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          placeholder={placeholder ?? '70000'}
          placeholderTextColor="#9ca3af"
          className="flex-1 text-black dark:text-white text-lg placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          accessibilityLabel={label ?? 'Money input'}
        />
      </View>

      {error ? (
        <Text className="text-red-400 mt-2 text-sm">{error}</Text>
      ) : helperText ? (
        <Text className="text-zinc-500 mt-2 text-sm">{helperText}</Text>
      ) : null}
    </KeyboardAvoidingView>
  );
}
