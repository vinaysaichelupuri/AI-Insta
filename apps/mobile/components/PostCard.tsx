import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { StatusBadge } from './StatusBadge';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import type { IPost } from '../services/api';

interface PostCardProps {
  post: IPost;
  onPress: (post: IPost) => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(post)}
      activeOpacity={0.75}
    >
      {/* Left accent bar based on status color */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: Colors.status[post.status] ?? Colors.textMuted },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.topic} numberOfLines={2}>
            {post.topic}
          </Text>
          <StatusBadge status={post.status} />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.meta}>{date}</Text>
          {post.slideCount !== undefined && (
            <Text style={styles.meta}>
              {post.slideCount} slide{post.slideCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  topic: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  chevron: {
    fontSize: 22,
    color: Colors.textMuted,
    paddingRight: Spacing.md,
  },
});
