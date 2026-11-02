import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useAppData} from '../context/AppDataContext';
import {RootStackParamList} from '../types';
import {AssignmentInput} from '../api/assignmentService';
import {validateAssignment} from '../utils/validators';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import ScreenContainer from '../components/common/ScreenContainer';
import FormInput from '../components/common/FormInput';
import AppButton from '../components/common/AppButton';
import EmptyState from '../components/common/EmptyState';
import FilterChips from '../components/common/FilterChips';

type AppNavigation = NativeStackNavigationProp<RootStackParamList>;

export function EditProfileScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {student, updateStudent, isPending} = useAppData();
  const [name, setName] = useState(student?.fullName ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [phone, setPhone] = useState(student?.phone ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({title: 'Chỉnh sửa thông tin'});
  }, [navigation]);

  useEffect(() => {
    setName(student?.fullName ?? '');
    setEmail(student?.email ?? '');
    setPhone(student?.phone ?? '');
  }, [student]);

  if (!student) {
    return (
      <ScreenContainer scroll>
        <EmptyState title="Chưa có thông tin sinh viên" />
      </ScreenContainer>
    );
  }

  const save = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Thông tin chưa đầy đủ', 'Vui lòng nhập họ tên, email và số điện thoại.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Email không hợp lệ', 'Vui lòng kiểm tra lại địa chỉ email.');
      return;
    }
    setSaving(true);
    try {
      const saved = await updateStudent({
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      if (saved) {
        navigation.goBack();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        <FormInput label="Họ và tên" value={name} onChangeText={setName} />
        <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <FormInput label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        {isPending('student') ? <Text style={styles.pending}>Bản sửa sẽ được đồng bộ khi có mạng.</Text> : null}
        <AppButton title="Lưu thay đổi" onPress={save} loading={saving} />
      </View>
    </ScreenContainer>
  );
}

export function AssignmentFormScreen() {
  const navigation = useNavigation<AppNavigation>();
  const {courses, createAssignment} = useAppData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [courseId, setCourseId] = useState<string | number>(courses[0]?.id ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({title: 'Thêm bài tập'});
  }, [navigation]);
  useEffect(() => {
    if (courseId === '' && courses.length) {
      setCourseId(courses[0].id);
    }
  }, [courseId, courses]);

  const save = async () => {
    const error = validateAssignment(title, date);
    if (error) {
      Alert.alert('Thông tin chưa hợp lệ', error);
      return;
    }
    if (courseId === '') {
      Alert.alert('Chưa chọn môn học', 'Vui lòng tải hoặc chọn một môn học.');
      return;
    }
    const input: AssignmentInput = {
      courseId,
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(`${date}T23:59:00`).toISOString(),
      status: 'todo',
    };
    setSaving(true);
    try {
      if (await createAssignment(input)) {
        navigation.goBack();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.page}>
        {!courses.length ? (
          <EmptyState title="Chưa có môn học" description="Kết nối máy chủ để thêm môn học trước." />
        ) : (
          <>
            <FormInput label="Tiêu đề bài tập" value={title} onChangeText={setTitle} />
            <FormInput label="Mô tả" value={description} onChangeText={setDescription} multiline />
            <Text style={styles.label}>Môn học</Text>
            <FilterChips
              options={courses.map(course => course.name)}
              selected={courses.find(course => String(course.id) === String(courseId))?.name ?? ''}
              onSelect={name =>
                setCourseId(courses.find(course => course.name === name)?.id ?? '')
              }
            />
            <FormInput
              label="Hạn nộp (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              keyboardType="numbers-and-punctuation"
            />
            <AppButton title="Lưu bài tập" onPress={save} loading={saving} />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: {padding: spacing.xl},
  label: {fontSize: 13, fontWeight: '700', color: colors.muted},
  pending: {fontSize: 13, color: colors.warning, marginBottom: spacing.md},
});
