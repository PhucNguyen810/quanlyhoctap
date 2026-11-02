import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

/** @param label Tên trường dữ liệu. @param value Nội dung trường. */
export default function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, gap: spacing.md},
  label: {fontSize: 13, color: colors.muted},
  value: {flexShrink: 1, textAlign: 'right', fontSize: 13, color: colors.text, fontWeight: '600'},
});
