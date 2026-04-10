// app/sign-up.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { COLORS } from '../constants/styles';

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().min(3, 'At least 3 characters').required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'Need at least one uppercase letter')
    .matches(/[0-9]/, 'Need at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const getFriendlyError = (code: string) => {
  switch (code) {
    case 'auth/email-already-in-use': return 'This email is already registered.';
    case 'auth/weak-password': return 'Password is too weak.';
    case 'auth/invalid-email': return 'Please enter a valid email.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default: return 'Something went wrong. Please try again.';
  }
};

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setAuthError('');
      try {
        await signUp(values.email, values.password);
        // AuthGate will auto-redirect to home after signup
      } catch (error: any) {
        setAuthError(getFriendlyError(error.code));
      } finally {
        setLoading(false);
      }
    },
  });

  const getPasswordStrength = (password: string) => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: 'Weak', color: '#DC2626' };
    if (score === 2) return { label: 'Fair', color: '#D97706' };
    if (score === 3) return { label: 'Good', color: '#2563EB' };
    return { label: 'Strong', color: '#16A34A' };
  };

  const passwordStrength = getPasswordStrength(formik.values.password);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>FF</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us today — it's free!</Text>
          </View>

          <View style={styles.card}>
            {authError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {authError}</Text>
              </View>
            ) : null}

            <FormInput
              label="Full Name"
              placeholder="John Doe"
              iconName="person-outline"
              value={formik.values.fullName}
              onChangeText={formik.handleChange('fullName')}
              onBlur={formik.handleBlur('fullName')}
              error={formik.errors.fullName}
              touched={formik.touched.fullName}
            />

            <FormInput
              label="Email Address"
              placeholder="you@example.com"
              iconName="mail-outline"
              keyboardType="email-address"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              error={formik.errors.email}
              touched={formik.touched.email}
            />

            <FormInput
              label="Password"
              placeholder="Min. 8 characters"
              iconName="lock-closed-outline"
              isPassword
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              error={formik.errors.password}
              touched={formik.touched.password}
            />

            {formik.values.password.length > 0 && passwordStrength && (
              <View style={styles.strengthContainer}>
                <View style={[styles.strengthBar, { backgroundColor: passwordStrength.color }]} />
                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
            )}

            <FormInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              iconName="shield-checkmark-outline"
              isPassword
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange('confirmPassword')}
              onBlur={formik.handleBlur('confirmPassword')}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
            />

            <SubmitButton
              title="Create Account"
              onPress={formik.handleSubmit}
              disabled={!formik.isValid || !formik.dirty}
              loading={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/sign-in')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  logoText: { fontSize: 26, fontWeight: '800', color: COLORS.white },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: COLORS.textMuted },
  card: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  errorBanner: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorBannerText: { color: COLORS.error, fontSize: 13, fontWeight: '500' },
  strengthContainer: { flexDirection: 'row', alignItems: 'center', marginTop: -10, marginBottom: 16, gap: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '600', width: 50 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});
