// app/employee-form.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, SafeAreaView,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { globalStyles, COLORS } from '../constants/styles';

const EmployeeSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'At least 2 characters').max(50).required('First name is required'),
  lastName: Yup.string().min(2, 'At least 2 characters').max(50).required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Phone is required'),
  department: Yup.string().min(2, 'At least 2 characters').required('Department is required'),
  jobTitle: Yup.string().min(2, 'At least 2 characters').required('Job title is required'),
  employeeId: Yup.string()
    .matches(/^[A-Za-z0-9]{4,10}$/, 'Must be 4–10 alphanumeric characters')
    .required('Employee ID is required'),
});

export default function EmployeeFormScreen() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '', lastName: '', email: '',
      phone: '', department: '', jobTitle: '', employeeId: '',
    },
    validationSchema: EmployeeSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        // Save to Firestore — attach userId so data is user-scoped
        await addDoc(collection(db, 'employees'), {
          ...values,
          userId: user?.uid,          // links record to this user
          createdAt: serverTimestamp(), // server-side timestamp
        });

        Alert.alert(
          '✅ Saved!',
          `${values.firstName} ${values.lastName} has been registered.`,
          [
            { text: 'Add Another', onPress: () => resetForm() },
            { text: 'View Submissions', onPress: () => router.push('/submissions') },
          ]
        );
      } catch (error: any) {
        Alert.alert(
          '❌ Save Failed',
          'Could not save the record. Check your connection and try again.',
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Text style={globalStyles.title}>Employee Registration</Text>
        <Text style={globalStyles.subtitle}>All fields are required.</Text>

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
            title="Save to Database"
            onPress={formik.handleSubmit}
            disabled={!formik.isValid || !formik.dirty}
            loading={loading}
          />

          <SubmitButton
            title="Reset Form"
            onPress={() => formik.resetForm()}
            style={styles.resetBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  resetBtn: { backgroundColor: COLORS.textMuted, marginTop: 8, shadowOpacity: 0, elevation: 0 },
});
