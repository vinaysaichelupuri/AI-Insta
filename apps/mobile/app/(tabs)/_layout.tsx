import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';

function TabIcon({ label, emoji }: { label: string; emoji: string }) {
  return null; // Icons handled by emoji in tabBarIcon
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.surfaceBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.brandPurple,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Queue',
          tabBarIcon: ({ color }) => (
            // Simple emoji-based icons (no dependency required)
            <TabEmoji emoji="⏳" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: 'Generate',
          tabBarIcon: ({ color }) => <TabEmoji emoji="✦" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabEmoji emoji="📋" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabEmoji emoji="⚙️" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Lightweight emoji tab icon helper
import { Text } from 'react-native';
function TabEmoji({ emoji, color }: { emoji: string; color: string | unknown }) {
  const isActive = String(color) === Colors.brandPurple;
  return (
    <Text style={{ fontSize: 20, opacity: isActive ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}
