// Settings Screen

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { getInstagramConnectionStatus } from '../../services/api';

interface IGStatus {
  connected: boolean;
  username?: string;
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [igStatus, setIgStatus] = useState<IGStatus | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [savedUrl, setSavedUrl] = useState('');

  useEffect(() => {
    getInstagramConnectionStatus()
      .then(setIgStatus)
      .catch(() => setIgStatus({ connected: false }));

    AsyncStorage.getItem('custom_backend_url').then((v) => {
      if (v) {
        setCustomUrl(v);
        setSavedUrl(v);
      }
    });
  }, []);

  const handleSaveUrl = async () => {
    await AsyncStorage.setItem('custom_backend_url', customUrl.trim());
    setSavedUrl(customUrl.trim());
    Alert.alert('Saved', 'Restart the app for the URL change to take effect.');
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* User Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.card}>
            <View style={styles.profileRow}>
              {user?.picture ? (
                <Image source={{ uri: user.picture }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarEmoji}>👤</Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name ?? 'Creator'}</Text>
                <Text style={styles.profileEmail}>{user?.email ?? '—'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instagram Status */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Instagram</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.igDot, { backgroundColor: igStatus?.connected ? Colors.success : Colors.error }]} />
              <Text style={styles.rowText}>
                {igStatus?.connected
                  ? `Connected as @${igStatus.username ?? 'unknown'}`
                  : 'Not connected'}
              </Text>
            </View>
            {!igStatus?.connected && (
              <Text style={styles.igHint}>
                Connect your Instagram account from the web app to enable publishing.
              </Text>
            )}
          </View>
        </View>

        {/* Backend URL */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Backend URL</Text>
          <View style={styles.card}>
            <Text style={styles.urlHint}>
              Override the default API server URL (e.g., your Cloudflare tunnel).
              Requires app restart.
            </Text>
            <TextInput
              style={styles.urlInput}
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="https://your-tunnel.trycloudflare.com"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <TouchableOpacity
              style={[styles.saveBtn, customUrl === savedUrl && styles.saveBtnDisabled]}
              onPress={handleSaveUrl}
              disabled={customUrl === savedUrl}
            >
              <Text style={styles.saveBtnText}>Save URL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App</Text>
          <View style={styles.card}>
            {[
              { label: 'Version', value: '1.0.0' },
              { label: 'Platform', value: 'React Native (Expo)' },
              { label: 'Backend', value: savedUrl || 'http://localhost:4000 (default)' },
            ].map((item) => (
              <View key={item.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg },
  header: { paddingTop: Spacing.sm },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  section: { gap: Spacing.xs },
  sectionLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.surfaceBorder, gap: Spacing.sm,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surfaceElevated, justifyContent: 'center', alignItems: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  profileEmail: { fontSize: FontSize.sm, color: Colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  igDot: { width: 10, height: 10, borderRadius: 5 },
  rowText: { fontSize: FontSize.md, color: Colors.textPrimary },
  igHint: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  urlHint: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  urlInput: {
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.surfaceBorder,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 11,
    color: Colors.textPrimary, fontSize: FontSize.sm,
  },
  saveBtn: {
    backgroundColor: Colors.brandPurple, borderRadius: Radius.md,
    paddingVertical: 10, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  infoValue: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1, textAlign: 'right', paddingLeft: Spacing.sm },
  signOutBtn: {
    backgroundColor: `${Colors.error}22`, borderWidth: 1, borderColor: `${Colors.error}55`,
    borderRadius: Radius.lg, paddingVertical: 14, alignItems: 'center',
  },
  signOutText: { color: Colors.error, fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
