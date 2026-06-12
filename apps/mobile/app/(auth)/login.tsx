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
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { BASE_URL } from '../../services/api';

type Tab = 'login' | 'register';

export default function LoginScreen() {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Login failed');
      await signIn(data.token);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Account created! You can now log in.');
      setTab('login');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo / Brand */}
        <View style={styles.brand}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>✦</Text>
          </View>
          <Text style={styles.brandName}>AI-Insta</Text>
          <Text style={styles.tagline}>Instagram Carousel Publisher</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, tab === 'login' && styles.tabActive]}
              onPress={() => { setTab('login'); setError(''); setSuccess(''); }}
            >
              <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
                Log In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'register' && styles.tabActive]}
              onPress={() => { setTab('register'); setError(''); setSuccess(''); }}
            >
              <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </Text>

            {error ? (
              <View style={styles.alertError}>
                <Text style={styles.alertErrorText}>⚠ {error}</Text>
              </View>
            ) : null}
            {success ? (
              <View style={styles.alertSuccess}>
                <Text style={styles.alertSuccessText}>✓ {success}</Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="creator@example.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={tab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {tab === 'login' ? 'Log In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brandPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.brandPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 30,
    color: '#fff',
  },
  brandName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  tabActive: {
    backgroundColor: Colors.brandPurple,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  form: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  formTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  alertError: {
    backgroundColor: `${Colors.error}22`,
    borderWidth: 1,
    borderColor: `${Colors.error}55`,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  alertErrorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
  },
  alertSuccess: {
    backgroundColor: `${Colors.success}22`,
    borderWidth: 1,
    borderColor: `${Colors.success}55`,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  alertSuccessText: {
    color: Colors.success,
    fontSize: FontSize.sm,
  },
  field: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  submitBtn: {
    backgroundColor: Colors.brandPurple,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.xs,
    shadowColor: Colors.brandPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
