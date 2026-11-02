import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppButton from './AppButton';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export default function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>!</Text>
      <Text style={styles.message}>{message}</Text>
      <AppButton title="Thử lại" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl},
  icon: {fontSize: 30, color: colors.danger, fontWeight: '800'},
  message: {color: colors.text, textAlign: 'center', marginVertical: spacing.md},
});
