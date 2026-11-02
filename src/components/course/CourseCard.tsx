import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Course} from '../../types';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

/** @param course Môn học cần hiển thị. @param onPress Mở chi tiết môn học. */
function CourseCard({course, onPress}: {course: Course; onPress: () => void}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Mở môn ${course.name}`}
      onPress={onPress}
      style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.credits}>{course.credits} tín chỉ</Text>
      </View>
      <Text style={styles.name}>{course.name}</Text>
      <Text style={styles.lecturer}>{course.lecturer}</Text>
    </Pressable>
  );
}

export default React.memo(CourseCard);

const styles = StyleSheet.create({
  card: {backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.sm},
  top: {flexDirection: 'row', justifyContent: 'space-between'},
  code: {fontWeight: '800', color: colors.accentDark},
  credits: {fontSize: 12, color: colors.muted},
  name: {fontSize: 16, fontWeight: '700', color: colors.text, marginVertical: spacing.sm},
  lecturer: {fontSize: 13, color: colors.muted},
});
