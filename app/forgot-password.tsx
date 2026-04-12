// app/forgot-password.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../config/firebase';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { COLORS } from '../constants/styles';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const getFriendlyError = (code: string) => {
  switch (code) {
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/invalid-email': return 'Please enter a valid email.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default: return 'Something went wrong. Please try again.';
  }
};

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setAuthError('');
      try {
        // Firebase sends a reset email automatically
        await sendPasswordResetEmail(auth, values.email);
        Alert.alert(
          '📧 Email Sent!',
          `A password reset link has been sent to ${values.email}. Check your inbox.`,
          [{ text: 'Back to Sign In', onPress: () => router.replace('/sign-in') }]
        );
      } catch (error: any) {
        setAuthError(getFriendlyError(error.code));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🔑</Text>
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a reset link.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {authError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {authError}</Text>
              </View>
            ) : null}

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

            <SubmitButton
              title="Send Reset Link"
              onPress={formik.handleSubmit}
              disabled={!formik.isValid || !formik.dirty}
              loading={loading}
            />

            {/* Back to Sign In */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.back()}>
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
  iconBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: COLORS.primary + '18',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  iconText: { fontSize: 36 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  errorBanner: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorBannerText: { color: COLORS.error, fontSize: 13, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});
