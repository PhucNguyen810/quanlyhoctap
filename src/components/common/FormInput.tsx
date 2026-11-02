import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numbers-and-punctuation';
  multiline?: boolean;
};

export default function FormInput({
  label,
  value,
  onChangeText,
  error = '',
  keyboardType = 'default',
  multiline = false,
}: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        style={[styles.input, multiline && styles.multiline, error ? styles.invalid : null]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {marginBottom: spacing.md},
  label: {fontSize: 13, fontWeight: '700', color: colors.muted, marginBottom: spacing.xs},
  input: {minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: spacing.md},
  multiline: {minHeight: 88, textAlignVertical: 'top', paddingTop: spacing.md},
  invalid: {borderColor: colors.danger},
  error: {color: colors.danger, marginTop: spacing.xs, fontSize: 12},
});
