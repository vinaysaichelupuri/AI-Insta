// History Screen
// Shows all historical posts with status filtering

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { PostCard } from '../../components/PostCard';
import { StatusBadge } from '../../components/StatusBadge';
import { usePosts } from '../../hooks/usePosts';
import type { PostStatus, IPost } from '../../services/api';

const FILTERS: Array<{ label: string; value: PostStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Draft', value: 'DRAFT' },
];

export default function HistoryScreen() {
  const { posts, isLoading, error, fetchPosts } = usePosts();
  const [filter, setFilter] = useState<PostStatus | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

  const filtered = filter === 'ALL' ? posts : posts.filter((p) => p.status === filter);

  const handlePress = (post: IPost) => {
    setExpandedId((prev) => (prev === post._id ? null : post._id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <Text style={styles.headerSub}>{posts.length} total posts</Text>
      </View>

      {/* Filter chips (horizontal scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.chip, filter === f.value && styles.chipActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.chipText, filter === f.value && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <PostCard post={item} onPress={handlePress} />
            {expandedId === item._id && (
              <View style={styles.expandedCard}>
                <StatusBadge status={item.status} />
                {item.caption && (
                  <>
                    <Text style={styles.expandedLabel}>Caption</Text>
                    <Text style={styles.expandedText}>{item.caption}</Text>
                  </>
                )}
                {item.hashtags && item.hashtags.length > 0 && (
                  <Text style={styles.hashtags}>{item.hashtags.join(' ')}</Text>
                )}
                {item.failReason && (
                  <View style={styles.failReason}>
                    <Text style={styles.failLabel}>Failure Reason</Text>
                    <Text style={styles.failText}>{item.failReason}</Text>
                  </View>
                )}
                {item.publishedAt && (
                  <Text style={styles.publishedAt}>
                    Published: {new Date(item.publishedAt).toLocaleString()}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchPosts}
            tintColor={Colors.brandPurple}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No posts found</Text>
              <Text style={styles.emptySubtext}>
                {filter === 'ALL' ? 'Generate your first carousel!' : `No ${filter.toLowerCase()} posts yet`}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  filters: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radius.pill, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  chipActive: { backgroundColor: Colors.brandPurple, borderColor: Colors.brandPurple },
  chipText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  expandedCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md,
    padding: Spacing.md, marginTop: -Spacing.sm, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.surfaceBorder, gap: Spacing.xs,
  },
  expandedLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 1, marginTop: Spacing.xs },
  expandedText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  hashtags: { fontSize: FontSize.sm, color: Colors.brandPurple },
  failReason: {
    backgroundColor: `${Colors.error}22`, borderRadius: Radius.sm,
    padding: Spacing.sm, borderWidth: 1, borderColor: `${Colors.error}55`,
  },
  failLabel: { fontSize: FontSize.xs, color: Colors.error, fontWeight: FontWeight.semibold },
  failText: { fontSize: FontSize.sm, color: Colors.textPrimary, marginTop: 2 },
  publishedAt: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  emptySubtext: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
