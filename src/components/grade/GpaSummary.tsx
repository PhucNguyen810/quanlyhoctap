import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

/** @param gpa GPA hệ 4. @param totalCredits Số tín chỉ tích lũy. */
export default function GpaSummary({
  gpa,
  totalCredits,
}: {
  gpa: number;
  totalCredits: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.caption}>GPA TÍCH LŨY</Text>
      <Text style={styles.score}>{gpa.toFixed(2)} / 4.00</Text>
      <Text style={styles.credits}>{totalCredits} tín chỉ tích lũy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {backgroundColor: colors.accent, borderRadius: 18, padding: spacing.xl, alignItems: 'center'},
  caption: {fontSize: 11, fontWeight: '800', color: colors.accentDark},
  score: {fontSize: 32, fontWeight: '800', color: colors.text, marginVertical: spacing.xs},
  credits: {fontSize: 13, color: colors.text},
});
