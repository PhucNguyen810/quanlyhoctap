import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppButton from './AppButton';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export default function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <AppButton title="Thử lại" onPress={onRetry} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: spacing.md, backgroundColor: colors.surface, borderRadius: 12, marginVertical: spacing.sm},
  message: {fontSize: 13, color: colors.danger, marginBottom: spacing.sm},
});
