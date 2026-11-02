import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Assignment} from '../../types';
import {formatDate, isOverdue} from '../../utils/date';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import SyncBadge from '../common/SyncBadge';
import StatusToggle from './StatusToggle';

/** @param assignment Bài tập cần hiển thị. @param pending Thao tác còn chờ đồng bộ. @param onPress Mở chi tiết. @param onToggleStatus Đổi trạng thái. */
function AssignmentItem({
  assignment,
  pending,
  onPress,
  onToggleStatus,
}: {
  assignment: Assignment;
  pending: boolean;
  onPress: () => void;
  onToggleStatus: () => void;
}) {
  const overdue = assignment.status === 'todo' && isOverdue(assignment.dueDate);
  return (
    <View style={[styles.card, overdue && styles.overdue]}>
      <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Chi tiết bài tập ${assignment.title}`}
        onPress={onPress}
        style={styles.content}>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.course}>{assignment.course?.name ?? 'Môn học'}</Text>
        <Text style={[styles.due, overdue && styles.overdueText]}>
          Hạn nộp: {formatDate(assignment.dueDate)}
        </Text>
        <SyncBadge pending={pending} />
      </Pressable>
    </View>
  );
}

export default React.memo(AssignmentItem);

const styles = StyleSheet.create({
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: spacing.sm, marginBottom: spacing.sm},
  overdue: {borderColor: colors.danger},
  content: {flex: 1, padding: spacing.sm, gap: spacing.xs},
  title: {fontSize: 14, fontWeight: '700', color: colors.text},
  course: {fontSize: 12, color: colors.muted},
  due: {fontSize: 12, color: colors.text},
  overdueText: {color: colors.danger, fontWeight: '700'},
});
