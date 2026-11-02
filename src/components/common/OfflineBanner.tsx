import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNetworkStatus} from '../../hooks/useNetworkStatus';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export default function OfflineBanner() {
  const {isOnline} = useNetworkStatus();
  if (isOnline) {
    return null;
  }
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Bạn đang offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {backgroundColor: colors.warningBackground, padding: spacing.sm},
  text: {color: colors.warning, textAlign: 'center', fontWeight: '700'},
});
