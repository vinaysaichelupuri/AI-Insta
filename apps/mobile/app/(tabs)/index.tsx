// Home / Queue Screen
// Shows posts pending review and approved posts ready to publish

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { PostCard } from '../../components/PostCard';
import { CarouselViewer } from '../../components/CarouselViewer';
import { StatusBadge } from '../../components/StatusBadge';
import { usePosts } from '../../hooks/usePosts';
import {
  getPost,
  updatePostStatus,
  publishPost,
  IPost,
  ISlide,
} from '../../services/api';
import * as Haptics from 'expo-haptics';

type ActionFilter = 'ALL' | 'PENDING_REVIEW' | 'APPROVED';

export default function QueueScreen() {
  const { posts, isLoading, error, fetchPosts, updatePost } = usePosts();
  const [filter, setFilter] = useState<ActionFilter>('ALL');

  // Preview modal state
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [slides, setSlides] = useState<ISlide[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Load queue when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

  const filtered = posts.filter((p) => {
    if (filter === 'ALL') return ['PENDING_REVIEW', 'APPROVED', 'RENDERING'].includes(p.status);
    return p.status === filter;
  });

  const openPost = async (post: IPost) => {
    setSelectedPost(post);
    setSlides([]);
    setActionError(null);
    setLoadingDetail(true);
    try {
      const res = await getPost(post._id);
      setSlides(res.slides ?? []);
    } catch (e: unknown) {
      setActionError('Failed to load slides');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleAction = async (status: string) => {
    if (!selectedPost) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await updatePostStatus(selectedPost._id, status);
      const updated = res.post;
      updatePost(updated);
      setSelectedPost(updated);
      if (status === 'REJECTED') setSelectedPost(null);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedPost) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await publishPost(selectedPost._id);
      const updated = res.post;
      updatePost(updated);
      setSelectedPost(updated);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Queue</Text>
        <Text style={styles.headerSub}>Posts awaiting your action</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filters}>
        {(['ALL', 'PENDING_REVIEW', 'APPROVED'] as ActionFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f === 'ALL' ? 'All Active' : f === 'PENDING_REVIEW' ? 'Pending' : 'Approved'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠ {error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchPosts()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostCard post={item} onPress={openPost} />
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
              <View style={styles.center}>
                <Text style={styles.emptyEmoji}>🎉</Text>
                <Text style={styles.emptyText}>No posts in queue</Text>
                <Text style={styles.emptySubtext}>Generate a new carousel to get started</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Preview Modal */}
      <Modal
        visible={!!selectedPost}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPost(null)}
      >
        <SafeAreaView style={styles.modal}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedPost(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedPost?.topic}
            </Text>
            {selectedPost && <StatusBadge status={selectedPost.status} />}
          </View>

          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Carousel */}
            {loadingDetail ? (
              <View style={styles.center}>
                <ActivityIndicator color={Colors.brandPurple} size="large" />
                <Text style={styles.loadingText}>Loading slides…</Text>
              </View>
            ) : (
              selectedPost && (
                <CarouselViewer postId={selectedPost._id} slides={slides} />
              )
            )}

            {/* Caption */}
            {selectedPost?.caption && (
              <View style={styles.captionCard}>
                <Text style={styles.captionLabel}>Caption</Text>
                <Text style={styles.captionText}>{selectedPost.caption}</Text>
                {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                  <Text style={styles.hashtags}>
                    {selectedPost.hashtags.join(' ')}
                  </Text>
                )}
              </View>
            )}

            {/* Error */}
            {actionError && (
              <View style={styles.alertError}>
                <Text style={styles.alertErrorText}>⚠ {actionError}</Text>
              </View>
            )}

            {/* Actions */}
            {selectedPost && selectedPost.status !== 'PUBLISHED' && (
              <View style={styles.actions}>
                {selectedPost.status !== 'APPROVED' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionReject]}
                      onPress={() => handleAction('REJECTED')}
                      disabled={actionLoading}
                    >
                      <Text style={styles.actionBtnText}>✕ Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionRegenerate]}
                      onPress={() => handleAction('RENDERING')}
                      disabled={actionLoading}
                    >
                      <Text style={styles.actionBtnText}>↺ Regenerate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionApprove]}
                      onPress={() => handleAction('APPROVED')}
                      disabled={actionLoading}
                    >
                      <Text style={styles.actionBtnText}>✓ Approve</Text>
                    </TouchableOpacity>
                  </>
                )}
                {selectedPost.status === 'APPROVED' && (
                  <TouchableOpacity
                    style={[styles.actionBtnFull, actionLoading && styles.btnDisabled]}
                    onPress={handlePublish}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.publishText}>🚀 Publish to Instagram</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
            {selectedPost?.status === 'PUBLISHED' && (
              <View style={styles.publishedBanner}>
                <Text style={styles.publishedText}>✓ Successfully Published!</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  filters: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  chipActive: { backgroundColor: Colors.brandPurple, borderColor: Colors.brandPurple },
  chipText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  errorText: { color: Colors.error, fontSize: FontSize.md, textAlign: 'center' },
  retryBtn: {
    marginTop: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  retryText: { color: Colors.textPrimary, fontSize: FontSize.sm },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  emptySubtext: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  // Modal
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  closeBtn: { fontSize: 18, color: Colors.textMuted },
  modalTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  modalBody: { padding: Spacing.lg, gap: Spacing.lg },
  loadingText: { color: Colors.textMuted, fontSize: FontSize.sm, marginTop: Spacing.sm },
  captionCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, gap: Spacing.xs, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  captionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  captionText: { fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  hashtags: { fontSize: FontSize.sm, color: Colors.brandPurple, marginTop: Spacing.xs },
  alertError: {
    backgroundColor: `${Colors.error}22`, borderWidth: 1,
    borderColor: `${Colors.error}55`, borderRadius: Radius.sm, padding: Spacing.sm,
  },
  alertErrorText: { color: Colors.error, fontSize: FontSize.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    flex: 1, paddingVertical: 12, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  actionReject: { backgroundColor: `${Colors.error}33`, borderWidth: 1, borderColor: Colors.error },
  actionRegenerate: { backgroundColor: `${Colors.warning}33`, borderWidth: 1, borderColor: Colors.warning },
  actionApprove: { backgroundColor: `${Colors.success}33`, borderWidth: 1, borderColor: Colors.success },
  actionBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  actionBtnFull: {
    backgroundColor: Colors.brandPurple, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center',
    shadowColor: Colors.brandPurple, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  publishText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
  publishedBanner: {
    backgroundColor: `${Colors.success}22`, borderWidth: 1, borderColor: Colors.success,
    borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center',
  },
  publishedText: { color: Colors.success, fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
