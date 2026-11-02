import React, {useCallback, useEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {courseService} from '../api/courseService';
import {sessionService} from '../api/sessionService';
import {assignmentService} from '../api/assignmentService';
import {gradeService} from '../api/gradeService';
import {useCachedQuery} from '../hooks/useCachedQuery';
import {useAppData} from '../context/AppDataContext';
import {RootStackParamList} from '../types';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {formatDate} from '../utils/date';
import {toScale4} from '../utils/gpa';
import ScreenContainer from '../components/common/ScreenContainer';
import LoadingView from '../components/common/LoadingView';
import ErrorView from '../components/common/ErrorView';
import EmptyState from '../components/common/EmptyState';
import LastUpdatedText from '../components/common/LastUpdatedText';
import AppButton from '../components/common/AppButton';
import SyncBadge from '../components/common/SyncBadge';
import SessionCard from '../components/schedule/SessionCard';
import AssignmentItem from '../components/assignment/AssignmentItem';
import InfoRow from '../components/profile/InfoRow';
import GradeRow from '../components/grade/GradeRow';
import FilterChips from '../components/common/FilterChips';
import InlineError from '../components/common/InlineError';
import {Routes} from '../navigation/routes';

type AppNavigation = NativeStackNavigationProp<RootStackParamList>;

export function CourseDetailScreen() {
  const {id} = useRoute<RouteProp<RootStackParamList, 'CourseDetail'>>().params;
  const navigation = useNavigation<AppNavigation>();
  const {sessions, assignments, isPending, toggleAssignment} = useAppData();
  const fetchCourse = useCallback(() => courseService.getById(id), [id]);
  const query = useCachedQuery(`course-${id}`, fetchCourse);
  useEffect(() => {
    navigation.setOptions({title: query.data?.name ?? 'Chi tiết môn học'});
  }, [navigation, query.data?.name]);

  if (query.loading && !query.data) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (query.error && !query.data) {
    return <ScreenContainer><ErrorView message={query.error} onRetry={query.refresh} /></ScreenContainer>;
  }
  if (!query.data) {
    return <ScreenContainer><EmptyState title="Không tìm thấy môn học" /></ScreenContainer>;
  }
  const course = query.data;
  const courseSessions = sessions.filter(item => String(item.courseId) === String(id));
  const courseAssignments = assignments.filter(item => String(item.courseId) === String(id));

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        <Text style={styles.title}>{course.name}</Text>
        <Text style={styles.subtitle}>{course.code} · {course.credits} tín chỉ</Text>
        <LastUpdatedText timestamp={query.lastUpdated} />
        <View style={styles.card}>
          <InfoRow label="Giảng viên" value={course.lecturer} />
          <InfoRow label="Học kỳ" value={course.semester} />
          <Text style={styles.description}>{course.description}</Text>
        </View>
        <Text style={styles.section}>Lịch học</Text>
        {courseSessions.length ? courseSessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onPress={() => navigation.navigate(Routes.SessionDetail, {id: session.id})}
          />
        )) : <EmptyState title="Chưa có lịch học cho môn này" />}
        <Text style={styles.section}>Bài tập</Text>
        {courseAssignments.length ? courseAssignments.map(assignment => (
          <AssignmentItem
            key={assignment.id}
            assignment={assignment}
            pending={isPending('assignment', assignment.id)}
            onPress={() => navigation.navigate(Routes.AssignmentDetail, {id: assignment.id})}
            onToggleStatus={() => toggleAssignment(assignment.id)}
          />
        )) : <EmptyState title="Chưa có bài tập cho môn này" />}
      </View>
    </ScreenContainer>
  );
}

export function ClassDetailScreen() {
  const {id} = useRoute<RouteProp<RootStackParamList, 'SessionDetail'>>().params;
  const navigation = useNavigation<AppNavigation>();
  const fetchSession = useCallback(() => sessionService.getById(id), [id]);
  const query = useCachedQuery(`session-${id}`, fetchSession);
  useEffect(() => {
    navigation.setOptions({title: query.data?.course?.name ?? 'Chi tiết buổi học'});
  }, [navigation, query.data?.course?.name]);

  if (query.loading && !query.data) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (query.error && !query.data) {
    return <ScreenContainer><ErrorView message={query.error} onRetry={query.refresh} /></ScreenContainer>;
  }
  if (!query.data) return <ScreenContainer><EmptyState title="Không tìm thấy buổi học" /></ScreenContainer>;
  const session = query.data;

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        <Text style={styles.title}>{session.course?.name ?? 'Buổi học'}</Text>
        <LastUpdatedText timestamp={query.lastUpdated} />
        <View style={styles.card}>
          <InfoRow label="Thời gian" value={`${session.startTime} – ${session.endTime}`} />
          <InfoRow label="Phòng học" value={session.room} />
          <InfoRow label="Ghi chú" value={session.note || 'Không có'} />
        </View>
        <View style={styles.buttonGap}>
          <AppButton
            title="Xem chi tiết môn học"
            onPress={() => navigation.navigate(Routes.CourseDetail, {id: session.courseId})}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

export function AssignmentDetailScreen() {
  const {id} = useRoute<RouteProp<RootStackParamList, 'AssignmentDetail'>>().params;
  const navigation = useNavigation<AppNavigation>();
  const {assignments, toggleAssignment, isPending} = useAppData();
  const fetchAssignment = useCallback(() => assignmentService.getById(id), [id]);
  const query = useCachedQuery(`assignment-${id}`, fetchAssignment);
  useEffect(() => {
    navigation.setOptions({title: query.data?.title ?? 'Chi tiết bài tập'});
  }, [navigation, query.data?.title]);

  if (query.loading && !query.data) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (query.error && !query.data) {
    return <ScreenContainer><ErrorView message={query.error} onRetry={query.refresh} /></ScreenContainer>;
  }
  if (!query.data) return <ScreenContainer><EmptyState title="Không tìm thấy bài tập" /></ScreenContainer>;
  const assignment =
    assignments.find(item => String(item.id) === String(id)) ?? query.data;
  const pending = isPending('assignment', assignment.id);

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.subtitle}>{assignment.course?.name ?? 'Bài tập'}</Text>
        <LastUpdatedText timestamp={query.lastUpdated} />
        <SyncBadge pending={pending} />
        <View style={styles.card}>
          <InfoRow label="Trạng thái" value={assignment.status === 'done' ? 'Đã xong' : 'Chưa xong'} />
          <InfoRow label="Hạn nộp" value={formatDate(assignment.dueDate)} />
          <Text style={styles.description}>{assignment.description}</Text>
        </View>
        <View style={styles.buttonGap}>
          <AppButton
            title={assignment.status === 'done' ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
            onPress={() => {
              toggleAssignment(id);
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

export function GradeDetailScreen() {
  const {id} = useRoute<RouteProp<RootStackParamList, 'GradeDetail'>>().params;
  const navigation = useNavigation<AppNavigation>();
  const fetchGrade = useCallback(() => gradeService.getById(id), [id]);
  const query = useCachedQuery(`grade-${id}`, fetchGrade);
  useEffect(() => {
    navigation.setOptions({title: query.data?.course?.name ?? 'Kết quả học tập'});
  }, [navigation, query.data?.course?.name]);

  if (query.loading && !query.data) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (query.error && !query.data) {
    return <ScreenContainer><ErrorView message={query.error} onRetry={query.refresh} /></ScreenContainer>;
  }
  if (!query.data) return <ScreenContainer><EmptyState title="Không tìm thấy kết quả học tập" /></ScreenContainer>;
  const grade = query.data;

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        <Text style={styles.title}>{grade.course?.name ?? 'Kết quả học tập'}</Text>
        <Text style={styles.subtitle}>{grade.course?.code} · {grade.semester}</Text>
        <LastUpdatedText timestamp={query.lastUpdated} />
        <View style={styles.card}>
          <InfoRow label="Chuyên cần" value={grade.attendance.toFixed(1)} />
          <InfoRow label="Giữa kỳ" value={grade.midterm.toFixed(1)} />
          <InfoRow label="Cuối kỳ" value={grade.final.toFixed(1)} />
          <InfoRow label="Tổng kết" value={grade.total.toFixed(2)} />
          <InfoRow label="Điểm chữ" value={grade.letter} />
          <InfoRow label="Điểm hệ 4" value={toScale4(grade.total).toFixed(1)} />
        </View>
      </View>
    </ScreenContainer>
  );
}

export function GradeListScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {grades, courses, loading, error, refreshing, lastUpdated, refreshAll} = useAppData();
  const [semester, setSemester] = React.useState('Tất cả');
  const semesters = ['Tất cả', ...new Set(grades.map(item => item.semester))];
  const filtered = grades.filter(item => semester === 'Tất cả' || item.semester === semester);

  if (loading && !grades.length) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (error && !grades.length) {
    return <ScreenContainer><ErrorView message={error} onRetry={refreshAll} /></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        refreshing={refreshing}
        onRefresh={refreshAll}
        contentContainerStyle={styles.listPage}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Bảng điểm</Text>
            <LastUpdatedText timestamp={lastUpdated} />
            {error ? <InlineError message={error} onRetry={refreshAll} /> : null}
            <FilterChips options={semesters} selected={semester} onSelect={setSemester} />
          </View>
        }
        renderItem={({item}) => {
          const course = item.course ?? courses.find(
            courseRow => String(courseRow.id) === String(item.courseId),
          );
          return (
            <GradeRow
              grade={{...item, course}}
              onPress={() => navigation.navigate(Routes.GradeDetail, {id: item.id})}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState title="Không có điểm trong học kỳ này" description="Chọn học kỳ khác." />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: {padding: spacing.xl},
  listPage: {flexGrow: 1, padding: spacing.xl},
  title: {fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.sm},
  subtitle: {fontSize: 14, color: colors.muted, marginBottom: spacing.md},
  card: {backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, marginTop: spacing.md},
  description: {fontSize: 14, lineHeight: 21, color: colors.text, marginTop: spacing.md},
  section: {fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md},
  buttonGap: {marginTop: spacing.md},
});
