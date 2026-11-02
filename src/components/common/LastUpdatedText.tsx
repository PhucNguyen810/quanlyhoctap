import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {formatDateTime} from '../../utils/date';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export default function LastUpdatedText({timestamp}: {timestamp: string}) {
  if (!timestamp) {
    return null;
  }
  return (
    <Text style={styles.text}>Cập nhật lần cuối: {formatDateTime(timestamp)}</Text>
  );
}

const styles = StyleSheet.create({
  text: {fontSize: 12, color: colors.muted, marginVertical: spacing.sm},
});
