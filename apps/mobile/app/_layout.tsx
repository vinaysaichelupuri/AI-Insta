import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Colors } from '../constants/theme';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { registerForPushNotifications } from '../services/notifications';

SplashScreen.preventAutoHideAsync();

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    border: Colors.surfaceBorder,
    primary: Colors.brandPurple,
    text: Colors.textPrimary,
    notification: Colors.brandPink,
  },
};

function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Register push notifications once authenticated
      registerForPushNotifications().catch(console.warn);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)/login" />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    // Using system fonts; add expo-google-fonts here if desired
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={AppTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
