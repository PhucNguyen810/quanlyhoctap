import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export default function LoadingView({message = 'Đang tải…'}: {message?: string}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accentDark} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md},
  message: {color: colors.muted},
});
