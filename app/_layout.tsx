// app/_layout.tsx
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/styles';

// ─── Auth Gate ────────────────────────────────────────────────────────────────
// Redirects users based on their auth state
function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // wait until session is checked

    const publicScreens = ['sign-in', 'sign-up', 'forgot-password'];
    const inAuthGroup = publicScreens.includes(segments[0] as string);

    if (!user && !inAuthGroup) {
      // Not logged in → send to sign-in
      router.replace('/sign-in');
    } else if (user && inAuthGroup) {
      // Logged in → send to home
      router.replace('/');
    }
  }, [user, isLoading, segments]);

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.white,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Dashboard', headerBackVisible: false }} />
          <Stack.Screen name="employee-form" options={{ title: 'Employee Information' }} />
          <Stack.Screen name="submissions" options={{ title: 'Submissions' }} />
          <Stack.Screen name="submission-detail" options={{ title: 'Submission Detail' }} />
          <Stack.Screen name="edit-employee" options={{ title: 'Edit Employee' }} />
          <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        </Stack>
      </AuthGate>
    </AuthProvider>
  );
}
