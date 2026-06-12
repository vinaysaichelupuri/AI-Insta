import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing, FontWeight } from '../constants/theme';
import type { PostStatus } from '../services/api';

const LABELS: Record<PostStatus, string> = {
  DRAFT: 'Draft',
  RENDERING: 'Rendering…',
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
  FAILED: 'Failed',
};

interface StatusBadgeProps {
  status: PostStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = Colors.status[status] ?? Colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}55` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
});
