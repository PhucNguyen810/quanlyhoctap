import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: Props) {
  const outline = variant === 'outline';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        outline ? styles.outline : styles.primary,
        (disabled || loading) && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={outline ? colors.accentDark : colors.surface} />
      ) : (
        <Text style={[styles.text, outline && styles.outlineText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {minHeight: 48, minWidth: 48, paddingHorizontal: spacing.lg, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  primary: {backgroundColor: colors.accentDark},
  outline: {borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface},
  disabled: {opacity: 0.55},
  text: {color: colors.surface, fontWeight: '700'},
  outlineText: {color: colors.accentDark},
});
