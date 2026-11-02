import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {dayOfWeekNumber} from '../../utils/date';

const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

/** @param selectedDay Ngày đang chọn theo quy ước 2–8. @param onSelectDay Chọn ngày. */
export default function DaySelector({
  selectedDay,
  onSelectDay,
}: {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {days.map((day, index) => {
        const value = index + 2;
        const active = selectedDay === value;
        return (
          <Pressable
            key={day}
            accessibilityRole="button"
            accessibilityLabel={day}
            accessibilityState={{selected: active}}
            onPress={() => onSelectDay(value)}
            style={[styles.day, active && styles.active]}>
            <Text style={[styles.label, active && styles.activeLabel]}>{day}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function todayAsDayOfWeek() {
  return dayOfWeekNumber();
}

const styles = StyleSheet.create({
  row: {gap: spacing.sm, paddingVertical: spacing.sm},
  day: {minHeight: 44, minWidth: 60, paddingHorizontal: spacing.sm, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border},
  active: {backgroundColor: colors.accentDark, borderColor: colors.accentDark},
  label: {fontSize: 12, color: colors.text},
  activeLabel: {color: colors.surface, fontWeight: '700'},
});
