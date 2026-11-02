import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import OfflineBanner from './OfflineBanner';

type Props = React.PropsWithChildren<{scroll?: boolean}>;

export default function ScreenContainer({children, scroll = false}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  content: {padding: 20, paddingBottom: 32},
});
