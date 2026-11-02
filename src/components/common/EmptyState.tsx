import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppButton from './AppButton';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  description = '',
  actionLabel = 'Thử lại',
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onAction ? <AppButton title={actionLabel} onPress={onAction} variant="outline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', padding: spacing.xl},
  title: {fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center'},
  description: {fontSize: 14, color: colors.muted, textAlign: 'center', marginVertical: spacing.sm},
});
