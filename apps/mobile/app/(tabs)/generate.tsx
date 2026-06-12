// Generate Screen
// Submit a new topic to generate an Instagram carousel

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { submitTopic } from '../../services/api';

const TOPIC_SUGGESTIONS = [
  '5 Python tips for beginners',
  'How AI is changing content creation',
  'Morning routine for productivity',
  'Top 3 design principles',
  'What is machine learning?',
];

export default function GenerateScreen() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  const handleSubmit = async (confirm = false) => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setDuplicateWarning(false);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const res = await submitTopic(topic.trim(), confirm);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess(`🎉 "${res.post?.topic ?? topic}" is being generated! Check the Queue tab.`);
      setTopic('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Submission failed';
      if (msg.toLowerCase().includes('duplicate')) {
        setDuplicateWarning(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Generate</Text>
            <Text style={styles.headerSub}>Create a new Instagram carousel</Text>
          </View>

          {/* Input Card */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Topic</Text>
            <TextInput
              style={styles.input}
              value={topic}
              onChangeText={(t) => {
                setTopic(t);
                setError(null);
                setSuccess(null);
                setDuplicateWarning(false);
              }}
              placeholder="e.g. 5 Python tips for beginners"
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={200}
              returnKeyType="done"
            />
            <Text style={styles.charCount}>{topic.length}/200</Text>

            {error && (
              <View style={styles.alertError}>
                <Text style={styles.alertErrorText}>⚠ {error}</Text>
              </View>
            )}
            {success && (
              <View style={styles.alertSuccess}>
                <Text style={styles.alertSuccessText}>{success}</Text>
              </View>
            )}
            {duplicateWarning && (
              <View style={styles.alertWarning}>
                <Text style={styles.alertWarningText}>
                  ⚠ A similar topic already exists. Generate anyway?
                </Text>
                <View style={styles.dupActions}>
                  <TouchableOpacity
                    style={styles.dupCancel}
                    onPress={() => setDuplicateWarning(false)}
                  >
                    <Text style={styles.dupCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dupConfirm}
                    onPress={() => handleSubmit(true)}
                  >
                    <Text style={styles.dupConfirmText}>Generate Anyway</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!topic.trim() || loading) && styles.submitBtnDisabled,
              ]}
              onPress={() => handleSubmit(false)}
              disabled={!topic.trim() || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>✦ Generate Carousel</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Suggestions */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>💡 Try these topics</Text>
            {TOPIC_SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.suggestion}
                onPress={() => {
                  setTopic(s);
                  setError(null);
                  setSuccess(null);
                  setDuplicateWarning(false);
                }}
              >
                <Text style={styles.suggestionText}>{s}</Text>
                <Text style={styles.suggestionArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it works</Text>
            <View style={styles.steps}>
              {[
                { num: '1', text: 'Enter a topic and tap Generate' },
                { num: '2', text: 'AI writes the slides & caption' },
                { num: '3', text: 'Review & approve in the Queue' },
                { num: '4', text: 'Publish directly to Instagram' },
              ].map((step) => (
                <View key={step.num} style={styles.step}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{step.num}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg },
  header: { paddingTop: Spacing.sm },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  inputLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.surfaceBorder,
    borderRadius: Radius.md, padding: Spacing.md, color: Colors.textPrimary,
    fontSize: FontSize.md, minHeight: 100, textAlignVertical: 'top',
  },
  charCount: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'right', marginTop: -Spacing.sm },
  alertError: {
    backgroundColor: `${Colors.error}22`, borderWidth: 1,
    borderColor: `${Colors.error}55`, borderRadius: Radius.sm, padding: Spacing.sm,
  },
  alertErrorText: { color: Colors.error, fontSize: FontSize.sm },
  alertSuccess: {
    backgroundColor: `${Colors.success}22`, borderWidth: 1,
    borderColor: `${Colors.success}55`, borderRadius: Radius.sm, padding: Spacing.sm,
  },
  alertSuccessText: { color: Colors.success, fontSize: FontSize.sm },
  alertWarning: {
    backgroundColor: `${Colors.warning}22`, borderWidth: 1,
    borderColor: `${Colors.warning}55`, borderRadius: Radius.sm, padding: Spacing.sm, gap: Spacing.sm,
  },
  alertWarningText: { color: Colors.warning, fontSize: FontSize.sm },
  dupActions: { flexDirection: 'row', gap: Spacing.sm },
  dupCancel: {
    flex: 1, paddingVertical: 8, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.surfaceBorder, alignItems: 'center',
  },
  dupCancelText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  dupConfirm: {
    flex: 1, paddingVertical: 8, borderRadius: Radius.sm,
    backgroundColor: Colors.warning, alignItems: 'center',
  },
  dupConfirmText: { color: '#000', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  submitBtn: {
    backgroundColor: Colors.brandPurple, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center',
    shadowColor: Colors.brandPurple, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
  suggestionsSection: { gap: Spacing.sm },
  suggestionsTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  suggestion: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  suggestionText: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },
  suggestionArrow: { fontSize: 16, color: Colors.brandPurple },
  infoCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  infoTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  steps: { gap: Spacing.sm },
  step: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: `${Colors.brandPurple}33`,
    borderWidth: 1, borderColor: Colors.brandPurple,
    justifyContent: 'center', alignItems: 'center',
  },
  stepNumText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.brandPurple },
  stepText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
});
