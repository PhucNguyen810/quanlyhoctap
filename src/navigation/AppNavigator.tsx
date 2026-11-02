import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList, TabParamList} from '../types';
import {useAppData} from '../context/AppDataContext';
import {colors} from '../theme/colors';
import {
  AssignmentsScreen,
  CoursesScreen,
  HomeScreen,
  ProfileScreen,
  ScheduleScreen,
} from '../screens/MainScreens';
import {
  AssignmentDetailScreen,
  ClassDetailScreen,
  CourseDetailScreen,
  GradeDetailScreen,
  GradeListScreen,
} from '../screens/DetailScreens';
import {AssignmentFormScreen, EditProfileScreen} from '../screens/FormScreens';
import {Routes} from './routes';

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStackNav = createNativeStackNavigator<RootStackParamList>();
const CourseStackNav = createNativeStackNavigator<RootStackParamList>();
const ScheduleStackNav = createNativeStackNavigator<RootStackParamList>();
const AssignmentStackNav = createNativeStackNavigator<RootStackParamList>();
const ProfileStackNav = createNativeStackNavigator<RootStackParamList>();

function HomeStack() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen name={Routes.Home} component={HomeScreen} options={{title: 'Tổng quan'}} />
      <HomeStackNav.Screen name={Routes.CourseDetail} component={CourseDetailScreen} />
      <HomeStackNav.Screen name={Routes.SessionDetail} component={ClassDetailScreen} />
      <HomeStackNav.Screen name={Routes.AssignmentDetail} component={AssignmentDetailScreen} />
    </HomeStackNav.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {fontSize: 20, color: colors.accentDark},
});

function CourseStack() {
  return (
    <CourseStackNav.Navigator>
      <CourseStackNav.Screen name={Routes.CourseList} component={CoursesScreen} options={{title: 'Môn học'}} />
      <CourseStackNav.Screen name={Routes.CourseDetail} component={CourseDetailScreen} />
      <CourseStackNav.Screen name={Routes.SessionDetail} component={ClassDetailScreen} />
      <CourseStackNav.Screen name={Routes.AssignmentDetail} component={AssignmentDetailScreen} />
    </CourseStackNav.Navigator>
  );
}

function ScheduleStack() {
  return (
    <ScheduleStackNav.Navigator>
      <ScheduleStackNav.Screen name={Routes.Schedule} component={ScheduleScreen} options={{title: 'Thời khóa biểu'}} />
      <ScheduleStackNav.Screen name={Routes.SessionDetail} component={ClassDetailScreen} />
      <ScheduleStackNav.Screen name={Routes.CourseDetail} component={CourseDetailScreen} />
    </ScheduleStackNav.Navigator>
  );
}

function AssignmentStack() {
  return (
    <AssignmentStackNav.Navigator>
      <AssignmentStackNav.Screen name={Routes.AssignmentList} component={AssignmentsScreen} options={{title: 'Bài tập'}} />
      <AssignmentStackNav.Screen name={Routes.AssignmentDetail} component={AssignmentDetailScreen} />
      <AssignmentStackNav.Screen name={Routes.AssignmentForm} component={AssignmentFormScreen} />
    </AssignmentStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen name={Routes.Profile} component={ProfileScreen} options={{title: 'Cá nhân'}} />
      <ProfileStackNav.Screen name={Routes.EditProfile} component={EditProfileScreen} />
      <ProfileStackNav.Screen name={Routes.GradeList} component={GradeListScreen} options={{title: 'Bảng điểm'}} />
      <ProfileStackNav.Screen name={Routes.GradeDetail} component={GradeDetailScreen} />
    </ProfileStackNav.Navigator>
  );
}

function TabIcon({symbol}: {symbol: string}) {
  return <Text style={styles.tabIcon}>{symbol}</Text>;
}

function HomeIcon() {
  return <TabIcon symbol="⌂" />;
}

function CoursesIcon() {
  return <TabIcon symbol="▤" />;
}

function ScheduleIcon() {
  return <TabIcon symbol="▦" />;
}

function AssignmentsIcon() {
  return <TabIcon symbol="✓" />;
}

function ProfileIcon() {
  return <TabIcon symbol="◎" />;
}

export default function AppNavigator() {
  const {assignments} = useAppData();
  const incomplete = assignments.filter(item => item.status === 'todo').length;
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {...DefaultTheme.colors, background: colors.background},
      }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accentDark,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {height: 68, paddingTop: 8, paddingBottom: 8, backgroundColor: colors.surface, borderTopColor: colors.border},
          tabBarLabelStyle: {fontSize: 10, fontWeight: '600'},
        }}>
        <Tab.Screen name="HomeTab" component={HomeStack} options={{tabBarLabel: 'Tổng quan', tabBarIcon: HomeIcon}} />
        <Tab.Screen name="CoursesTab" component={CourseStack} options={{tabBarLabel: 'Môn học', tabBarIcon: CoursesIcon}} />
        <Tab.Screen name="ScheduleTab" component={ScheduleStack} options={{tabBarLabel: 'Lịch học', tabBarIcon: ScheduleIcon}} />
        <Tab.Screen
          name="AssignmentsTab"
          component={AssignmentStack}
          options={{
            tabBarLabel: 'Bài tập',
            tabBarIcon: AssignmentsIcon,
            tabBarBadge: incomplete || undefined,
          }}
        />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={{tabBarLabel: 'Cá nhân', tabBarIcon: ProfileIcon}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
