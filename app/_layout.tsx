import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* StatusBar from new code (kept + unified) */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <Stack screenOptions={{ headerShown: false }}>

        {/* 🔵 Existing onboarding + auth flows */}
        <Stack.Screen name="onboarding/onboardingscreen" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="auth/otp" options={{ headerShown: false }} />

        {/* 🔵 Existing Tabs layout */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* 🔵 Existing Modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

        {/* 🔴 NEW ADDITIONS BELOW */}

        {/* Full-screen game player */}
        <Stack.Screen
          name="games/play"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />

        {/* Video player full-screen modal */}
        <Stack.Screen
          name="videos/watch"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />

        {/* Video History */}
        <Stack.Screen
          name="videos/history"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        {/* Personalized video feed */}
        <Stack.Screen
          name="videos/personalized"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        {/* Profile screens */}
        <Stack.Screen
          name="profile/settings"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="profile/parental-settings"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="profile/edit-profile"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="profile/achievements"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
