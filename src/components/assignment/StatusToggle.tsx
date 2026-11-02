import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';

/** @param status Trạng thái bài tập. @param onToggle Đổi trạng thái. */
export default function StatusToggle({
  status,
  onToggle,
}: {
  status: 'todo' | 'done';
  onToggle: () => void;
}) {
  const done = status === 'done';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      accessibilityState={{checked: done}}
      onPress={onToggle}
      style={styles.button}>
      <Text style={[styles.icon, done && styles.done]}>{done ? '✓' : '○'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center'},
  icon: {fontSize: 22, color: colors.warning},
  done: {color: colors.accentDark},
});
