import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ClassSession} from '../../types';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

/** @param session Buổi học cần hiển thị. @param onPress Mở chi tiết buổi học. */
function SessionCard({session, onPress}: {session: ClassSession; onPress: () => void}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Mở buổi học ${session.course?.name ?? ''}`}
      onPress={onPress}
      style={styles.card}>
      <View style={styles.time}>
        <Text style={styles.timeText}>{session.startTime}</Text>
        <Text style={styles.timeText}>{session.endTime}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{session.course?.name ?? 'Môn học'}</Text>
        <Text style={styles.room}>Phòng {session.room}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

export default React.memo(SessionCard);

const styles = StyleSheet.create({
  card: {minHeight: 76, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm},
  time: {width: 62, gap: spacing.xs},
  timeText: {fontSize: 12, color: colors.accentDark, fontWeight: '700'},
  info: {flex: 1},
  name: {fontSize: 14, color: colors.text, fontWeight: '700'},
  room: {fontSize: 12, color: colors.muted, marginTop: spacing.xs},
  arrow: {fontSize: 24, color: colors.muted},
});
