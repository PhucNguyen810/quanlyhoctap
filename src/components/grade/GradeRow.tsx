import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Grade} from '../../types';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

/** @param grade Kết quả học tập. @param onPress Mở chi tiết điểm. */
function GradeRow({grade, onPress}: {grade: Grade; onPress: () => void}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Xem điểm ${grade.course?.name ?? ''}`}
      onPress={onPress}
      style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{grade.course?.name ?? 'Môn học'}</Text>
        <Text style={styles.credits}>{grade.course?.credits ?? 0} tín chỉ · {grade.letter}</Text>
      </View>
      <Text style={styles.score}>{grade.total.toFixed(2)}</Text>
    </Pressable>
  );
}

export default React.memo(GradeRow);

const styles = StyleSheet.create({
  row: {minHeight: 64, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, padding: spacing.md, marginBottom: spacing.sm},
  info: {flex: 1},
  name: {fontSize: 14, fontWeight: '700', color: colors.text},
  credits: {fontSize: 12, color: colors.muted, marginTop: spacing.xs},
  score: {fontSize: 17, fontWeight: '800', color: colors.accentDark},
});
