import React, {useMemo, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useAppData} from '../context/AppDataContext';
import {RootStackParamList} from '../types';
import {Routes} from '../navigation/routes';
import {daysLeft} from '../utils/date';
import {calcGpa} from '../utils/gpa';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import ScreenContainer from '../components/common/ScreenContainer';
import LoadingView from '../components/common/LoadingView';
import ErrorView from '../components/common/ErrorView';
import InlineError from '../components/common/InlineError';
import EmptyState from '../components/common/EmptyState';
import LastUpdatedText from '../components/common/LastUpdatedText';
import SearchBar from '../components/common/SearchBar';
import FilterChips from '../components/common/FilterChips';
import AppButton from '../components/common/AppButton';
import SyncBadge from '../components/common/SyncBadge';
import CourseCard from '../components/course/CourseCard';
import DaySelector, {todayAsDayOfWeek} from '../components/schedule/DaySelector';
import SessionCard from '../components/schedule/SessionCard';
import AssignmentItem from '../components/assignment/AssignmentItem';
import GpaSummary from '../components/grade/GpaSummary';
import InfoRow from '../components/profile/InfoRow';

type AppNavigation = NativeStackNavigationProp<RootStackParamList>;

function ListError({message, onRetry}: {message: string; onRetry: () => void}) {
  return <ErrorView message={message} onRetry={onRetry} />;
}

export function HomeScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {
    student,
    courses,
    assignments,
    loading,
    error,
    lastUpdated,
    pendingCount,
    refreshAll,
    toggleAssignment,
    isPending,
  } = useAppData();
  const dueSoon = assignments.filter(item => {
    const remaining = daysLeft(item.dueDate);
    return item.status === 'todo' && remaining >= 0 && remaining <= 7;
  });

  if (loading && !student) {
    return <ScreenContainer><LoadingView /></ScreenContainer>;
  }
  if (error && !student) {
    return <ScreenContainer><ListError message={error} onRetry={refreshAll} /></ScreenContainer>;
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        <Text style={styles.eyebrow}>TỔNG QUAN</Text>
        <Text style={styles.title}>Xin chào, {student?.fullName ?? 'Sinh viên'}</Text>
        <Text style={styles.subtle}>{student?.studentCode}</Text>
        <LastUpdatedText timestamp={lastUpdated} />
        {error ? <InlineError message={error} onRetry={refreshAll} /> : null}
        <View style={styles.pendingCard}>
          <Text style={styles.pendingTitle}>Thay đổi chờ đồng bộ</Text>
          <Text style={styles.pendingNumber}>{pendingCount}</Text>
        </View>
        <SectionHeading title="Môn đang học" />
        {courses.slice(0, 3).map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => navigation.navigate(Routes.CourseDetail, {id: course.id})}
          />
        ))}
        {!courses.length ? (
          <EmptyState title="Chưa có môn học" description="Kéo xuống để tải lại dữ liệu." />
        ) : null}
        <SectionHeading title="Bài tập đến hạn trong 7 ngày" />
        {dueSoon.length ? (
          dueSoon.map(assignment => (
            <AssignmentItem
              key={assignment.id}
              assignment={assignment}
              pending={isPending('assignment', assignment.id)}
              onPress={() => navigation.navigate(Routes.AssignmentDetail, {id: assignment.id})}
              onToggleStatus={() => toggleAssignment(assignment.id)}
            />
          ))
        ) : (
          <EmptyState title="Không có bài tập sắp đến hạn" />
        )}
      </View>
    </ScreenContainer>
  );
}

export function CoursesScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {courses, loading, error, refreshing, lastUpdated, refreshAll} = useAppData();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('Tất cả');
  const semesters = useMemo(
    () => ['Tất cả', ...new Set(courses.map(course => course.semester))],
    [courses],
  );
  const filtered = courses.filter(course => {
    const matchesText = course.name.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi'));
    return matchesText && (semester === 'Tất cả' || course.semester === semester);
  });

  if (loading && !courses.length) {
    return <ScreenContainer><LoadingView /></ScreenContainer>;
  }
  if (error && !courses.length) {
    return <ScreenContainer><ListError message={error} onRetry={refreshAll} /></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        refreshing={refreshing}
        onRefresh={refreshAll}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Môn học</Text>
            <LastUpdatedText timestamp={lastUpdated} />
            {error ? <InlineError message={error} onRetry={refreshAll} /> : null}
            <SearchBar value={search} onChangeText={setSearch} placeholder="Tìm theo tên môn học" />
            <FilterChips options={semesters} selected={semester} onSelect={setSemester} />
            <SectionHeading title={`${filtered.length} môn học`} />
          </View>
        }
        renderItem={({item}) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate(Routes.CourseDetail, {id: item.id})}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            description="Thử từ khóa hoặc học kỳ khác."
          />
        }
      />
    </ScreenContainer>
  );
}

export function ScheduleScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {sessions, loading, error, refreshing, lastUpdated, refreshAll} = useAppData();
  const [day, setDay] = useState(todayAsDayOfWeek());
  const filtered = sessions.filter(session => session.dayOfWeek === day);

  if (loading && !sessions.length) {
    return <ScreenContainer><LoadingView /></ScreenContainer>;
  }
  if (error && !sessions.length) {
    return <ScreenContainer><ListError message={error} onRetry={refreshAll} /></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        refreshing={refreshing}
        onRefresh={refreshAll}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Thời khóa biểu</Text>
            <LastUpdatedText timestamp={lastUpdated} />
            {error ? <InlineError message={error} onRetry={refreshAll} /> : null}
            <DaySelector selectedDay={day} onSelectDay={setDay} />
            <SectionHeading title="Buổi học" />
          </View>
        }
        renderItem={({item}) => (
          <SessionCard
            session={item}
            onPress={() => navigation.navigate(Routes.SessionDetail, {id: item.id})}
          />
        )}
        ListEmptyComponent={
          <EmptyState title="Không có buổi học trong ngày này" description="Chọn một ngày khác." />
        }
      />
    </ScreenContainer>
  );
}

export function AssignmentsScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {
    assignments,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshAll,
    toggleAssignment,
    isPending,
  } = useAppData();
  const [filter, setFilter] = useState('Tất cả');
  const filtered = assignments.filter(item => {
    if (filter === 'Chưa xong') return item.status === 'todo' && daysLeft(item.dueDate) >= 0;
    if (filter === 'Đã xong') return item.status === 'done';
    if (filter === 'Quá hạn') return item.status === 'todo' && daysLeft(item.dueDate) < 0;
    return true;
  });
  const renderItem = ({item}: ListRenderItemInfo<(typeof filtered)[number]>) => (
    <AssignmentItem
      assignment={item}
      pending={isPending('assignment', item.id)}
      onPress={() => navigation.navigate(Routes.AssignmentDetail, {id: item.id})}
      onToggleStatus={() => toggleAssignment(item.id)}
    />
  );

  if (loading && !assignments.length) {
    return <ScreenContainer><LoadingView /></ScreenContainer>;
  }
  if (error && !assignments.length) {
    return <ScreenContainer><ListError message={error} onRetry={refreshAll} /></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        refreshing={refreshing}
        onRefresh={refreshAll}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Bài tập</Text>
            <LastUpdatedText timestamp={lastUpdated} />
            {error ? <InlineError message={error} onRetry={refreshAll} /> : null}
            <FilterChips
              options={['Tất cả', 'Chưa xong', 'Đã xong', 'Quá hạn']}
              selected={filter}
              onSelect={setFilter}
            />
            <AppButton
              title="Thêm bài tập"
              onPress={() => navigation.navigate(Routes.AssignmentForm)}
            />
            <SectionHeading title={`${filtered.length} bài tập`} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState title="Không có bài tập trong mục này" description="Thử bộ lọc khác." />
        }
      />
    </ScreenContainer>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {
    student,
    grades,
    courses,
    loading,
    error,
    lastUpdated,
    pendingCount,
    isPending,
    refreshAll,
    syncNow,
    syncing,
  } = useAppData();
  const {gpa, totalCredits} = calcGpa(grades, courses);

  if (loading && !student) {
    return <ScreenContainer><LoadingView /></ScreenContainer>;
  }
  if (error && !student) {
    return <ScreenContainer><ListError message={error} onRetry={refreshAll} /></ScreenContainer>;
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        <Text style={styles.title}>Cá nhân</Text>
        <LastUpdatedText timestamp={lastUpdated} />
        {error ? <InlineError message={error} onRetry={refreshAll} /> : null}
        {student ? (
          <View style={styles.card}>
            <InfoRow label="Mã sinh viên" value={student.studentCode} />
            <InfoRow label="Họ và tên" value={student.fullName} />
            <InfoRow label="Lớp" value={student.className} />
            <InfoRow label="Ngành" value={student.major} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Điện thoại" value={student.phone} />
            <SyncBadge pending={isPending('student')} />
            <AppButton
              title="Chỉnh sửa thông tin"
              onPress={() => navigation.navigate(Routes.EditProfile)}
              variant="outline"
            />
          </View>
        ) : null}
        <SectionHeading title="Kết quả học tập" />
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />
        <View style={styles.buttonGap}>
          <AppButton title="Xem bảng điểm" onPress={() => navigation.navigate(Routes.GradeList)} />
        </View>
        {pendingCount > 0 ? (
          <View style={styles.buttonGap}>
            <AppButton title={syncing ? 'Đang đồng bộ…' : `Đồng bộ ${pendingCount} thay đổi`} onPress={syncNow} loading={syncing} variant="outline" />
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

function SectionHeading({title}: {title: string}) {
  return <Text style={styles.section}>{title}</Text>;
}

const styles = StyleSheet.create({
  page: {padding: spacing.xl},
  list: {padding: spacing.xl, paddingBottom: spacing.xxl, flexGrow: 1},
  eyebrow: {fontSize: 11, fontWeight: '800', color: colors.muted, marginBottom: spacing.sm},
  title: {fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: spacing.sm},
  subtle: {fontSize: 13, color: colors.muted},
  section: {fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md},
  pendingCard: {backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, marginTop: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  pendingTitle: {fontSize: 14, color: colors.text, fontWeight: '600'},
  pendingNumber: {fontSize: 24, color: colors.accentDark, fontWeight: '800'},
  card: {backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md},
  buttonGap: {marginTop: spacing.md},
});
