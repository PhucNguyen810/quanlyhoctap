import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export const colors = {
  background: '#F6F7F2',
  surface: '#FFFFFF',
  text: '#20291F',
  muted: '#788177',
  border: '#E6E9E1',
  accent: '#D8F27A',
  accentDark: '#344B20',
  softGreen: '#EEF5E2',
  orange: '#FFF0DC',
  orangeText: '#A85A16',
  red: '#FCE9E7',
  redText: '#B5473D',
};

export function Page({children}: React.PropsWithChildren) {
  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.heading}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({children, style}: React.PropsWithChildren<{style?: object}>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pill({
  label,
  tone = 'green',
}: {
  label: string;
  tone?: 'green' | 'orange' | 'red';
}) {
  const toneStyle =
    tone === 'orange'
      ? styles.orangePill
      : tone === 'red'
        ? styles.redPill
        : styles.greenPill;
  const textStyle =
    tone === 'orange'
      ? styles.orangePillText
      : tone === 'red'
        ? styles.redPillText
        : styles.greenPillText;
  return (
    <View style={[styles.pill, toneStyle]}>
      <Text style={[styles.pillText, textStyle]}>{label}</Text>
    </View>
  );
}

export function EmptyState({message}: {message: string}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyMark}>○</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

export function DetailRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        style={styles.field}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

export const uiStyles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  rowBetween: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  flex: {flex: 1},
  gap8: {gap: 8},
  gap12: {gap: 12},
  gap16: {gap: 16},
  top8: {marginTop: 8},
  top12: {marginTop: 12},
  top16: {marginTop: 16},
  top20: {marginTop: 20},
  top24: {marginTop: 24},
  bottom4: {marginBottom: 4},
});

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  pageContent: {padding: 20, paddingBottom: 32},
  heading: {marginTop: 6, marginBottom: 22},
  eyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pageTitle: {color: colors.text, fontSize: 27, fontWeight: '800', letterSpacing: -0.6},
  subtitle: {color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6},
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  sectionHeading: {color: colors.text, fontSize: 17, fontWeight: '700'},
  actionText: {color: colors.accentDark, fontSize: 13, fontWeight: '700'},
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  pill: {alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20},
  pillText: {fontSize: 11, fontWeight: '700'},
  greenPill: {backgroundColor: colors.softGreen},
  greenPillText: {color: colors.accentDark},
  orangePill: {backgroundColor: colors.orange},
  orangePillText: {color: colors.orangeText},
  redPill: {backgroundColor: colors.red},
  redPillText: {color: colors.redText},
  empty: {alignItems: 'center', padding: 28},
  emptyMark: {fontSize: 30, color: colors.muted, marginBottom: 8},
  emptyText: {color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 20},
  search: {
    height: 50,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchIcon: {fontSize: 22, color: colors.muted, marginRight: 10},
  searchInput: {flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  detailLabel: {color: colors.muted, fontSize: 13},
  detailValue: {color: colors.text, fontSize: 13, fontWeight: '600', textAlign: 'right', flexShrink: 1},
  fieldGroup: {marginBottom: 15},
  fieldLabel: {color: colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 7},
  field: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 14,
  },
});
