import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useStudent} from '../context/StudentContext';
import {classSessions, courses} from '../data/mockData';
import {Assignment, ClassSession, Course, RootStackParamList} from '../types';
import {
  Card,
  colors,
  DetailRow,
  EmptyState,
  Heading,
  Page,
  Pill,
  SearchField,
  SectionTitle,
  TextField,
  uiStyles,
} from '../components/ui';

type AppNavigation = NativeStackNavigationProp<RootStackParamList>;

function ListSeparator() {
  return <View style={styles.separator} />;
}

function CourseCard({course, onPress}: {course: Course; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card style={styles.listCard}>
        <View style={uiStyles.rowBetween}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{course.code}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
        <Text style={styles.cardTitle}>{course.name}</Text>
        <Text style={styles.secondaryText}>{course.credits} tín chỉ · {course.lecturer}</Text>
      </Card>
    </Pressable>
  );
}

function AssignmentCard({
  assignment,
  course,
  onPress,
  onToggle,
}: {
  assignment: Assignment;
  course?: Course;
  onPress: () => void;
  onToggle?: () => void;
}) {
  return (
    <Card style={styles.listCard}>
      <Pressable onPress={onPress} accessibilityRole="button">
        <View style={uiStyles.rowBetween}>
          <Pill
            label={assignment.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            tone={assignment.completed ? 'green' : 'orange'}
          />
          <Text style={styles.chevron}>›</Text>
        </View>
        <Text style={[styles.cardTitle, uiStyles.top12]}>{assignment.title}</Text>
        <Text style={styles.secondaryText}>{course?.code ?? 'Môn học'} · {course?.name ?? 'Chưa cập nhật'}</Text>
        <Text style={styles.dueText}>Hạn nộp: {assignment.dueDate}</Text>
      </Pressable>
      {onToggle ? (
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={assignment.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
          style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {assignment.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

function SessionCard({session, onPress}: {session: ClassSession; onPress: () => void}) {
  const course = courses.find(item => item.id === session.courseId);
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card style={styles.sessionCard}>
        <View style={styles.timeRail}>
          <Text style={styles.timeStart}>{session.startTime}</Text>
          <View style={styles.timeLine} />
          <Text style={styles.timeEnd}>{session.endTime}</Text>
        </View>
        <View style={uiStyles.flex}>
          <Text style={styles.dayText}>{session.day} · {session.date}</Text>
          <Text style={styles.cardTitle}>{course?.name ?? 'Môn học'}</Text>
          <Text style={styles.secondaryText}>Phòng {session.room}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Card>
    </Pressable>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {student, assignments} = useStudent();
  const pendingAssignments = assignments.filter(item => !item.completed);
  const averageGrade = useMemo(
    () =>
      courses.reduce((total, course) => total + course.grade * course.credits, 0) /
      courses.reduce((total, course) => total + course.credits, 0),
    [],
  );

  return (
    <Page>
      <View style={styles.homeTop}>
        <View>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.homeName}>{student.name.split(' ').slice(-2).join(' ')}</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>MA</Text></View>
      </View>
      <Text style={styles.studentId}>SINH VIÊN · {student.id}</Text>

      <Card style={styles.overviewCard}>
        <View style={uiStyles.rowBetween}>
          <View>
            <Text style={styles.overviewLabel}>ĐIỂM TRUNG BÌNH</Text>
            <Text style={styles.overviewScore}>{averageGrade.toFixed(1)}<Text style={styles.outOf}> / 10</Text></Text>
          </View>
          <View style={styles.overviewIcon}><Text style={styles.star}>✦</Text></View>
        </View>
        <View style={styles.overviewDivider} />
        <View style={uiStyles.rowBetween}>
          <Text style={styles.overviewFoot}>{courses.length} môn học trong học kỳ</Text>
          <Text style={styles.overviewFoot}>{assignments.filter(item => item.completed).length}/{assignments.length} bài đã xong</Text>
        </View>
      </Card>

      <SectionTitle
        title="Môn học của tôi"
        action="Tất cả"
        onAction={() => navigation.navigate('MainTabs', {screen: 'Courses'})}
      />
      {courses.slice(0, 3).map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}
        />
      ))}

      <SectionTitle
        title="Bài tập sắp đến hạn"
        action="Xem tất cả"
        onAction={() => navigation.navigate('MainTabs', {screen: 'Assignments'})}
      />
      {pendingAssignments.length ? (
        pendingAssignments.slice(0, 2).map(assignment => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            course={courses.find(course => course.id === assignment.courseId)}
            onPress={() => navigation.navigate('AssignmentDetail', {assignmentId: assignment.id})}
          />
        ))
      ) : (
        <Card><EmptyState message="Bạn đã hoàn thành tất cả bài tập." /></Card>
      )}
    </Page>
  );
}

export function CoursesScreen() {
  const navigation = useNavigation<AppNavigation>();
  const [search, setSearch] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  useEffect(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi');
    setFilteredCourses(
      courses.filter(course => course.name.toLocaleLowerCase('vi').includes(normalizedSearch)),
    );
  }, [search]);

  return (
    <FlatList
      data={filteredCourses}
      keyExtractor={course => course.id}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <Heading eyebrow="HỌC KỲ 1 · 2026–2027" title="Môn học" subtitle={`${courses.length} môn học đang theo học`} />
          <SearchField value={search} onChangeText={setSearch} placeholder="Tìm theo tên môn học..." />
          <SectionTitle title="Danh sách môn học" />
        </View>
      }
      renderItem={({item}) => (
        <CourseCard
          course={item}
          onPress={() => navigation.navigate('CourseDetail', {courseId: item.id})}
        />
      )}
      ItemSeparatorComponent={ListSeparator}
      ListEmptyComponent={<Card><EmptyState message="Không tìm thấy môn học phù hợp." /></Card>}
    />
  );
}

export function ScheduleScreen() {
  const navigation = useNavigation<AppNavigation>();
  const [selectedDay, setSelectedDay] = useState('Tất cả');
  const days = ['Tất cả', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const filteredSessions = selectedDay === 'Tất cả'
    ? classSessions
    : classSessions.filter(session => session.day === selectedDay);

  return (
    <FlatList
      data={filteredSessions}
      keyExtractor={session => session.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <Heading eyebrow="HỌC KỲ 1 · 2026–2027" title="Thời khóa biểu" subtitle="Lịch học trong tuần của bạn" />
          <FlatList
            horizontal
            data={days}
            keyExtractor={day => day}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayFilters}
            renderItem={({item}) => {
              const active = selectedDay === item;
              return (
                <Pressable
                  onPress={() => setSelectedDay(item)}
                  accessibilityRole="button"
                  accessibilityState={{selected: active}}
                  style={[styles.dayChip, active && styles.dayChipActive]}>
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{item}</Text>
                </Pressable>
              );
            }}
          />
          <SectionTitle title={selectedDay === 'Tất cả' ? 'Lịch trong tuần' : selectedDay} />
        </View>
      }
      renderItem={({item}) => (
        <SessionCard
          session={item}
          onPress={() => navigation.navigate('ClassDetail', {sessionId: item.id})}
        />
      )}
      ItemSeparatorComponent={ListSeparator}
      ListEmptyComponent={<Card><EmptyState message="Không có buổi học trong ngày này." /></Card>}
    />
  );
}

export function AssignmentsScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {assignments, toggleAssignment} = useStudent();
  const [filter, setFilter] = useState<'Tất cả' | 'Chưa xong' | 'Đã xong'>('Tất cả');
  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'Chưa xong') {
      return !assignment.completed;
    }
    if (filter === 'Đã xong') {
      return assignment.completed;
    }
    return true;
  });
  const filters: Array<'Tất cả' | 'Chưa xong' | 'Đã xong'> = ['Tất cả', 'Chưa xong', 'Đã xong'];

  return (
    <FlatList
      data={filteredAssignments}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <Heading eyebrow="HỌC KỲ 1 · 2026–2027" title="Bài tập" subtitle={`${assignments.length} bài tập · ${assignments.filter(item => !item.completed).length} bài chưa hoàn thành`} />
          <View style={styles.filters}>
            {filters.map(item => {
              const active = filter === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  accessibilityRole="button"
                  accessibilityState={{selected: active}}
                  style={[styles.filterChip, active && styles.filterChipActive]}>
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
          <SectionTitle title="Danh sách bài tập" />
        </View>
      }
      renderItem={({item}) => (
        <AssignmentCard
          assignment={item}
          course={courses.find(course => course.id === item.courseId)}
          onPress={() => navigation.navigate('AssignmentDetail', {assignmentId: item.id})}
          onToggle={() => toggleAssignment(item.id)}
        />
      )}
      ItemSeparatorComponent={ListSeparator}
      ListEmptyComponent={<Card><EmptyState message="Không có bài tập nào trong mục này." /></Card>}
    />
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {student, updateStudent} = useStudent();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const averageGrade = useMemo(
    () =>
      courses.reduce((total, course) => total + course.grade * course.credits, 0) /
      courses.reduce((total, course) => total + course.credits, 0),
    [],
  );

  useEffect(() => {
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone);
  }, [student]);

  const saveProfile = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Thông tin chưa đầy đủ', 'Vui lòng nhập họ tên, email và số điện thoại.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Email không hợp lệ', 'Vui lòng kiểm tra lại địa chỉ email.');
      return;
    }
    updateStudent({name: name.trim(), email: email.trim(), phone: phone.trim()});
    setEditing(false);
    Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật.');
  };

  return (
    <Page>
      <Heading eyebrow="HỒ SƠ SINH VIÊN" title="Cá nhân" subtitle="Quản lý thông tin và kết quả học tập" />
      <Card style={styles.profileHero}>
        <View style={styles.avatarLarge}><Text style={styles.avatarLargeText}>MA</Text></View>
        <Text style={styles.profileName}>{student.name}</Text>
        <Text style={styles.secondaryText}>{student.id}</Text>
      </Card>

      <SectionTitle title="Thông tin sinh viên" />
      <Card>
        {editing ? (
          <>
            <TextField label="Họ và tên" value={name} onChangeText={setName} />
            <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextField label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <View style={styles.buttonRow}>
              <Pressable onPress={() => setEditing(false)} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Hủy</Text>
              </Pressable>
              <Pressable onPress={saveProfile} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Lưu thay đổi</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <DetailRow label="Mã sinh viên" value={student.id} />
            <DetailRow label="Lớp" value={student.className} />
            <DetailRow label="Ngành học" value={student.major} />
            <DetailRow label="Email" value={student.email} />
            <DetailRow label="Điện thoại" value={student.phone} />
            <Pressable onPress={() => setEditing(true)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
            </Pressable>
          </>
        )}
      </Card>

      <SectionTitle title="Kết quả học tập" action="Xem chi tiết" onAction={() => navigation.navigate('GradeDetail', {courseId: courses[0].id})} />
      <Pressable onPress={() => navigation.navigate('GradeDetail', {courseId: courses[0].id})}>
        <Card style={styles.gradeSummary}>
          <View>
            <Text style={styles.overviewLabel}>ĐIỂM TRUNG BÌNH TÍCH LŨY</Text>
            <Text style={styles.gradeScore}>{averageGrade.toFixed(1)}<Text style={styles.outOf}> / 10</Text></Text>
            <Text style={styles.secondaryText}>{courses.reduce((total, course) => total + course.credits, 0)} tín chỉ · {courses.length} môn học</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Card>
      </Pressable>
      <SectionTitle title="Bảng điểm theo môn" />
      {courses.map(course => (
        <Pressable
          key={course.id}
          onPress={() => navigation.navigate('GradeDetail', {courseId: course.id})}>
          <Card style={styles.gradeRow}>
            <View style={uiStyles.flex}>
              <Text style={styles.gradeCode}>{course.code}</Text>
              <Text style={styles.cardTitle}>{course.name}</Text>
            </View>
            <Text style={styles.gradeValue}>{course.grade.toFixed(1)}</Text>
          </Card>
        </Pressable>
      ))}
    </Page>
  );
}

const styles = StyleSheet.create({
  listContent: {padding: 20, paddingBottom: 32},
  separator: {height: 10},
  homeTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8},
  greeting: {fontSize: 14, color: colors.muted},
  homeName: {fontSize: 29, fontWeight: '800', color: colors.text, marginTop: 2},
  studentId: {fontSize: 10, letterSpacing: 1, color: colors.muted, fontWeight: '700', marginTop: 8, marginBottom: 20},
  avatar: {height: 50, width: 50, borderRadius: 18, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center'},
  avatarText: {fontSize: 15, fontWeight: '800', color: colors.accentDark},
  overviewCard: {backgroundColor: colors.accent, borderColor: colors.accent, padding: 18},
  overviewLabel: {fontSize: 10, letterSpacing: 1, color: colors.accentDark, fontWeight: '800'},
  overviewScore: {fontSize: 36, fontWeight: '800', color: colors.text, marginTop: 4},
  outOf: {fontSize: 15, fontWeight: '500', color: colors.muted},
  overviewIcon: {width: 42, height: 42, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center'},
  star: {fontSize: 22, color: colors.accentDark},
  overviewDivider: {height: 1, backgroundColor: 'rgba(52,75,32,0.16)', marginVertical: 14},
  overviewFoot: {fontSize: 11, color: colors.accentDark, fontWeight: '600'},
  listCard: {marginBottom: 2},
  codeBadge: {backgroundColor: colors.softGreen, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8},
  codeText: {fontSize: 11, fontWeight: '800', color: colors.accentDark},
  cardTitle: {fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 20, marginTop: 9},
  secondaryText: {color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4},
  chevron: {color: colors.muted, fontSize: 24, marginLeft: 8},
  dueText: {color: colors.orangeText, fontSize: 12, fontWeight: '700', marginTop: 9},
  toggleButton: {alignSelf: 'flex-start', marginTop: 13, backgroundColor: colors.softGreen, paddingVertical: 8, paddingHorizontal: 11, borderRadius: 10},
  toggleText: {fontSize: 11, color: colors.accentDark, fontWeight: '700'},
  sessionCard: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13},
  timeRail: {width: 54, alignItems: 'center', marginRight: 12},
  timeStart: {fontSize: 11, fontWeight: '800', color: colors.accentDark},
  timeEnd: {fontSize: 10, color: colors.muted},
  timeLine: {width: 1, height: 14, backgroundColor: colors.border, marginVertical: 3},
  dayText: {fontSize: 10, color: colors.muted, fontWeight: '700'},
  dayFilters: {gap: 8, paddingBottom: 4},
  dayChip: {paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border},
  dayChipActive: {backgroundColor: colors.accentDark, borderColor: colors.accentDark},
  dayChipText: {fontSize: 12, color: colors.muted, fontWeight: '600'},
  dayChipTextActive: {color: colors.surface},
  filters: {flexDirection: 'row', gap: 8},
  filterChip: {paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border},
  filterChipActive: {backgroundColor: colors.accentDark, borderColor: colors.accentDark},
  filterText: {fontSize: 12, color: colors.muted, fontWeight: '600'},
  filterTextActive: {color: colors.surface},
  profileHero: {alignItems: 'center', paddingVertical: 23},
  avatarLarge: {height: 68, width: 68, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center'},
  avatarLargeText: {fontSize: 20, fontWeight: '800', color: colors.accentDark},
  profileName: {fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 12},
  buttonRow: {flexDirection: 'row', gap: 10, marginTop: 4},
  primaryButton: {flex: 1, minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentDark},
  primaryButtonText: {color: colors.surface, fontSize: 13, fontWeight: '700'},
  secondaryButton: {paddingHorizontal: 17, minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background},
  secondaryButtonText: {color: colors.text, fontSize: 13, fontWeight: '700'},
  editButton: {backgroundColor: colors.softGreen, alignItems: 'center', padding: 12, borderRadius: 11, marginTop: 14},
  editButtonText: {color: colors.accentDark, fontSize: 13, fontWeight: '700'},
  gradeSummary: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.softGreen},
  gradeScore: {fontSize: 31, fontWeight: '800', color: colors.text, marginTop: 5, marginBottom: 2},
  gradeRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9},
  gradeCode: {fontSize: 10, fontWeight: '800', color: colors.accentDark},
  gradeValue: {fontSize: 20, fontWeight: '800', color: colors.accentDark, marginLeft: 12},
});
