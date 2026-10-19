import React from 'react';
import {StatusBar, Text} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StudentProvider} from './src/context/StudentContext';
import {
  AssignmentsScreen,
  CoursesScreen,
  HomeScreen,
  ProfileScreen,
  ScheduleScreen,
} from './src/screens/MainScreens';
import {
  AssignmentDetailScreen,
  ClassDetailScreen,
  CourseDetailScreen,
  GradeDetailScreen,
} from './src/screens/DetailScreens';
import {RootStackParamList, TabParamList} from './src/types';
import {colors} from './src/components/ui';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: {fontSize: 10, fontWeight: '600'},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: 'Tổng quan', tabBarIcon: HomeTabIcon}}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{tabBarLabel: 'Môn học', tabBarIcon: CoursesTabIcon}}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{tabBarLabel: 'Lịch học', tabBarIcon: ScheduleTabIcon}}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{tabBarLabel: 'Bài tập', tabBarIcon: AssignmentsTabIcon}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{tabBarLabel: 'Cá nhân', tabBarIcon: ProfileTabIcon}}
      />
    </Tab.Navigator>
  );
}

function TabIcon({label}: {label: string}) {
  return <Text style={styles.tabIcon}>{label}</Text>;
}

function HomeTabIcon() {
  return <TabIcon label="⌂" />;
}

function CoursesTabIcon() {
  return <TabIcon label="▤" />;
}

function ScheduleTabIcon() {
  return <TabIcon label="▦" />;
}

function AssignmentsTabIcon() {
  return <TabIcon label="✓" />;
}

function ProfileTabIcon() {
  return <TabIcon label="◎" />;
}

function App() {
  return (
    <SafeAreaProvider>
      <StudentProvider>
        <NavigationContainer
          theme={{
            ...NavigationDefaultTheme,
            colors: {...NavigationDefaultTheme.colors, background: colors.background},
          }}>
          <StatusBar barStyle="dark-content" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {backgroundColor: colors.background},
              headerTintColor: colors.text,
              headerTitleStyle: {fontSize: 17, fontWeight: '700'},
              contentStyle: {backgroundColor: colors.background},
              headerShadowVisible: false,
            }}>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CourseDetail"
              component={CourseDetailScreen}
              options={{title: 'Chi tiết môn học'}}
            />
            <Stack.Screen
              name="ClassDetail"
              component={ClassDetailScreen}
              options={{title: 'Chi tiết buổi học'}}
            />
            <Stack.Screen
              name="AssignmentDetail"
              component={AssignmentDetailScreen}
              options={{title: 'Chi tiết bài tập'}}
            />
            <Stack.Screen
              name="GradeDetail"
              component={GradeDetailScreen}
              options={{title: 'Kết quả học tập'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StudentProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = {
  tabIcon: {fontSize: 20, color: colors.accentDark},
};
