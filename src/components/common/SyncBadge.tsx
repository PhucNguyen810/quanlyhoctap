import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export default function SyncBadge({pending}: {pending: boolean}) {
  if (!pending) {
    return null;
  }
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {alignSelf: 'flex-start', borderRadius: 20, backgroundColor: colors.warningBackground, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  text: {color: colors.warning, fontSize: 11, fontWeight: '700'},
});
