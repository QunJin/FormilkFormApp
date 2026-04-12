// app/edit-employee.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Alert, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../config/firebase';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { globalStyles, COLORS } from '../constants/styles';

const EmployeeSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'At least 2 characters').required('First name is required'),
  lastName: Yup.string().min(2, 'At least 2 characters').required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Phone is required'),
  department: Yup.string().min(2, 'At least 2 characters').required('Department is required'),
  jobTitle: Yup.string().min(2, 'At least 2 characters').required('Job title is required'),
  employeeId: Yup.string()
    .matches(/^[A-Za-z0-9]{4,10}$/, 'Must be 4–10 alphanumeric characters')
    .required('Employee ID is required'),
});

export default function EditEmployeeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '', lastName: '', email: '',
      phone: '', department: '', jobTitle: '', employeeId: '',
    },
    validationSchema: EmployeeSchema,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        // Update the existing Firestore document
        await updateDoc(doc(db, 'employees', id), {
          ...values,
          updatedAt: serverTimestamp(), // track when it was last updated
        });

        Alert.alert(
          '✅ Updated!',
          `${values.firstName} ${values.lastName}'s record has been updated.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } catch (err) {
        Alert.alert('❌ Update Failed', 'Could not update the record. Try again.');
      } finally {
        setSaving(false);
      }
    },
  });

  // Fetch the existing record and pre-fill the form
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'employees', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Set all form fields with existing values
          formik.setValues({
            firstName: data.firstName ?? '',
            lastName: data.lastName ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
            department: data.department ?? '',
            jobTitle: data.jobTitle ?? '',
            employeeId: data.employeeId ?? '',
          });
        } else {
          setError('Record not found.');
        }
      } catch (err) {
        setError('Failed to load record.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading record...</Text>
      </SafeAreaView>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Text style={globalStyles.title}>Edit Employee</Text>
        <Text style={globalStyles.subtitle}>Update the details below and save.</Text>

        <View style={globalStyles.card}>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <FormInput
                label="First Name" placeholder="John" iconName="person-outline"
                value={formik.values.firstName}
                onChangeText={formik.handleChange('firstName')}
                onBlur={formik.handleBlur('firstName')}
                error={formik.errors.firstName} touched={formik.touched.firstName}
              />
            </View>
            <View style={styles.halfField}>
              <FormInput
                label="Last Name" placeholder="Doe" iconName="person-outline"
                value={formik.values.lastName}
                onChangeText={formik.handleChange('lastName')}
                onBlur={formik.handleBlur('lastName')}
                error={formik.errors.lastName} touched={formik.touched.lastName}
              />
            </View>
          </View>

          <FormInput
            label="Email Address" placeholder="john.doe@company.com"
            iconName="mail-outline" keyboardType="email-address"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            error={formik.errors.email} touched={formik.touched.email}
          />

          <FormInput
            label="Phone Number" placeholder="4031234567"
            iconName="call-outline" keyboardType="phone-pad"
            value={formik.values.phone}
            onChangeText={formik.handleChange('phone')}
            onBlur={formik.handleBlur('phone')}
            error={formik.errors.phone} touched={formik.touched.phone}
          />

          <FormInput
            label="Department" placeholder="e.g. Engineering" iconName="business-outline"
            value={formik.values.department}
            onChangeText={formik.handleChange('department')}
            onBlur={formik.handleBlur('department')}
            error={formik.errors.department} touched={formik.touched.department}
          />

          <FormInput
            label="Job Title" placeholder="e.g. Software Developer" iconName="briefcase-outline"
            value={formik.values.jobTitle}
            onChangeText={formik.handleChange('jobTitle')}
            onBlur={formik.handleBlur('jobTitle')}
            error={formik.errors.jobTitle} touched={formik.touched.jobTitle}
          />

          <FormInput
            label="Employee ID" placeholder="e.g. EMP001" iconName="id-card-outline"
            autoCapitalize="characters"
            value={formik.values.employeeId}
            onChangeText={formik.handleChange('employeeId')}
            onBlur={formik.handleBlur('employeeId')}
            error={formik.errors.employeeId} touched={formik.touched.employeeId}
          />

          <SubmitButton
            title="Save Changes"
            onPress={formik.handleSubmit}
            disabled={!formik.isValid}
            loading={saving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 32, backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 12, color: COLORS.textMuted, fontSize: 15 },
  errorText: { fontSize: 16, color: COLORS.error, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
});
