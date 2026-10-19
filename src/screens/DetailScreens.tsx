import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useStudent} from '../context/StudentContext';
import {classSessions, courses} from '../data/mockData';
import {RootStackParamList} from '../types';
import {
  Card,
  colors,
  DetailRow,
  EmptyState,
  Heading,
  Page,
  Pill,
  SectionTitle,
} from '../components/ui';

type AppNavigation = NativeStackNavigationProp<RootStackParamList>;

function MissingItem({message}: {message: string}) {
  return (
    <Page>
      <Heading title="Không tìm thấy dữ liệu" />
      <Card><EmptyState message={message} /></Card>
    </Page>
  );
}

export function CourseDetailScreen() {
  const {courseId} = useRoute<RouteProp<RootStackParamList, 'CourseDetail'>>().params;
  const course = courses.find(item => item.id === courseId);
  if (!course) {
    return <MissingItem message="Môn học này không còn trong danh sách." />;
  }

  return (
    <Page>
      <Heading eyebrow={course.code} title={course.name} subtitle={`${course.credits} tín chỉ · Học kỳ 1 năm học 2026–2027`} />
      <Card>
        <DetailRow label="Mã môn học" value={course.code} />
        <DetailRow label="Số tín chỉ" value={`${course.credits} tín chỉ`} />
        <DetailRow label="Giảng viên" value={course.lecturer} />
        <DetailRow label="Phòng học" value={course.room} />
        <DetailRow label="Điểm hiện tại" value={`${course.grade.toFixed(1)} / 10`} />
      </Card>
      <SectionTitle title="Lịch học" />
      {classSessions.filter(session => session.courseId === course.id).map(session => (
        <Card key={session.id} style={styles.detailCard}>
          <Text style={styles.detailTitle}>{session.day}, {session.date}</Text>
          <Text style={styles.detailSubtitle}>{session.startTime}–{session.endTime} · Phòng {session.room}</Text>
        </Card>
      ))}
    </Page>
  );
}

export function ClassDetailScreen() {
  const {sessionId} = useRoute<RouteProp<RootStackParamList, 'ClassDetail'>>().params;
  const navigation = useNavigation<AppNavigation>();
  const session = classSessions.find(item => item.id === sessionId);
  const course = session ? courses.find(item => item.id === session.courseId) : undefined;
  if (!session || !course) {
    return <MissingItem message="Buổi học này không còn trong thời khóa biểu." />;
  }

  return (
    <Page>
      <Heading eyebrow={session.day} title={course.name} subtitle={session.date} />
      <Card>
        <DetailRow label="Môn học" value={`${course.code} · ${course.name}`} />
        <DetailRow label="Thời gian" value={`${session.startTime} – ${session.endTime}`} />
        <DetailRow label="Phòng học" value={session.room} />
        <DetailRow label="Giảng viên" value={session.lecturer} />
      </Card>
      <Pressable
        onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}
        style={styles.actionButton}>
        <Text style={styles.actionText}>Xem chi tiết môn học</Text>
      </Pressable>
    </Page>
  );
}

export function AssignmentDetailScreen() {
  const {assignmentId} = useRoute<RouteProp<RootStackParamList, 'AssignmentDetail'>>().params;
  const {assignments, toggleAssignment} = useStudent();
  const assignment = assignments.find(item => item.id === assignmentId);
  const course = assignment ? courses.find(item => item.id === assignment.courseId) : undefined;
  if (!assignment || !course) {
    return <MissingItem message="Bài tập này không còn trong danh sách." />;
  }

  return (
    <Page>
      <Heading eyebrow={course.code} title={assignment.title} subtitle={course.name} />
      <Card>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Trạng thái</Text>
          <Pill
            label={assignment.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            tone={assignment.completed ? 'green' : 'orange'}
          />
        </View>
        <DetailRow label="Môn học" value={`${course.code} · ${course.name}`} />
        <DetailRow label="Hạn nộp" value={assignment.dueDate} />
        <View style={styles.description}>
          <Text style={styles.label}>Mô tả bài tập</Text>
          <Text style={styles.bodyText}>{assignment.description}</Text>
        </View>
      </Card>
      <Pressable
        onPress={() => toggleAssignment(assignment.id)}
        accessibilityRole="button"
        style={styles.actionButton}>
        <Text style={styles.actionText}>
          {assignment.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
        </Text>
      </Pressable>
    </Page>
  );
}

export function GradeDetailScreen() {
  const {courseId} = useRoute<RouteProp<RootStackParamList, 'GradeDetail'>>().params;
  const navigation = useNavigation<AppNavigation>();
  const course = courses.find(item => item.id === courseId);
  if (!course) {
    return <MissingItem message="Không tìm thấy kết quả học tập của môn học này." />;
  }

  const gradeLabel = course.grade >= 8.5 ? 'Giỏi' : course.grade >= 7 ? 'Khá' : 'Trung bình';
  return (
    <Page>
      <Heading eyebrow="KẾT QUẢ HỌC TẬP" title={course.name} subtitle={course.code} />
      <Card style={styles.gradeCard}>
        <Text style={styles.gradeCaption}>ĐIỂM TỔNG KẾT</Text>
        <Text style={styles.gradeNumber}>{course.grade.toFixed(1)}<Text style={styles.gradeOutOf}> / 10</Text></Text>
        <Pill label={gradeLabel} />
      </Card>
      <SectionTitle title="Thông tin môn học" />
      <Card>
        <DetailRow label="Mã môn học" value={course.code} />
        <DetailRow label="Số tín chỉ" value={`${course.credits} tín chỉ`} />
        <DetailRow label="Giảng viên" value={course.lecturer} />
        <DetailRow label="Học kỳ" value="Học kỳ 1 · 2026–2027" />
      </Card>
      <Pressable
        onPress={() => navigation.navigate('CourseDetail', {courseId: course.id})}
        style={styles.actionButton}>
        <Text style={styles.actionText}>Xem chi tiết môn học</Text>
      </Pressable>
    </Page>
  );
}

const styles = StyleSheet.create({
  detailCard: {marginBottom: 9},
  detailTitle: {fontSize: 14, fontWeight: '700', color: colors.text},
  detailSubtitle: {fontSize: 12, color: colors.muted, marginTop: 5},
  statusRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10},
  label: {color: colors.muted, fontSize: 13, fontWeight: '600'},
  description: {paddingTop: 14},
  bodyText: {color: colors.text, fontSize: 14, lineHeight: 21, marginTop: 7},
  actionButton: {backgroundColor: colors.accentDark, borderRadius: 13, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 18},
  actionText: {color: colors.surface, fontWeight: '700', fontSize: 13},
  gradeCard: {alignItems: 'center', paddingVertical: 25, backgroundColor: colors.accent, borderColor: colors.accent},
  gradeCaption: {fontSize: 10, color: colors.accentDark, letterSpacing: 1, fontWeight: '800'},
  gradeNumber: {fontSize: 47, color: colors.text, fontWeight: '800', marginVertical: 5},
  gradeOutOf: {fontSize: 18, fontWeight: '500', color: colors.muted},
});
