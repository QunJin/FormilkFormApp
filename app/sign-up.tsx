// app/sign-up.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { globalStyles, COLORS } from '../constants/styles';

// ─── Yup Validation Schema ───────────────────────────────────────────────────
const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .required('Full name is required'),

  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
      Alert.alert(
        '✅ Account Created',
        `Welcome, ${values.fullName}! Your account has been created.`,
        [{ text: 'Sign In', onPress: () => router.push('/sign-in') }]
      );
    },
  });

  // Password strength indicator
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Text style={globalStyles.title}>Create Account</Text>
        <Text style={globalStyles.subtitle}>Join us today — it's free!</Text>

        <View style={globalStyles.card}>
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

          {/* Password strength bar */}
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
            <Text
              style={styles.footerLink}
              onPress={() => router.push('/sign-in')}
            >
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 16,
    gap: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
});