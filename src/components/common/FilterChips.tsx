import React from 'react';
import {ScrollView, Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export default function FilterChips({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map(option => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={`Lọc ${option}`}
            accessibilityState={{selected: active}}
            onPress={() => onSelect(option)}
            style={[styles.chip, active && styles.active]}>
            <Text style={[styles.label, active && styles.activeLabel]}>{option}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {gap: spacing.sm, paddingVertical: spacing.xs},
  chip: {minHeight: 44, paddingHorizontal: spacing.md, borderRadius: 24, backgroundColor: colors.surface, justifyContent: 'center', borderWidth: 1, borderColor: colors.border},
  active: {backgroundColor: colors.accentDark, borderColor: colors.accentDark},
  label: {color: colors.text, fontSize: 13},
  activeLabel: {color: colors.surface, fontWeight: '700'},
});
