// app/_layout.tsx
import { Stack } from 'expo-router';
import { COLORS } from '../constants/styles';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Form Demo App' }} />
      <Stack.Screen name="employee-form" options={{ title: 'Employee Information' }} />
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Create Account' }} />
    </Stack>
  );
}
