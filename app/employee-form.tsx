// app/employee-form.tsx
import { useFormik } from "formik";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from "yup";
import FormInput from "../components/FormInput";
import SubmitButton from "../components/SubmitButton";
import { COLORS, globalStyles } from "../constants/styles";

// ─── Yup Validation Schema ───────────────────────────────────────────────────
const EmployeeSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .required("First name is required"),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .required("Last name is required"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),

  department: Yup.string()
    .min(2, "Department must be at least 2 characters")
    .required("Department is required"),

  jobTitle: Yup.string()
    .min(2, "Job title must be at least 2 characters")
    .required("Job title is required"),

  employeeId: Yup.string()
    .matches(
      /^[A-Za-z0-9]{4,10}$/,
      "Employee ID must be 4–10 alphanumeric characters",
    )
    .required("Employee ID is required"),
});

export default function EmployeeFormScreen() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      jobTitle: "",
      employeeId: "",
    },
    validationSchema: EmployeeSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
      Alert.alert(
        "✅ Success!",
        `Employee ${values.firstName} ${values.lastName} has been registered.`,
        [{ text: "OK", onPress: () => resetForm() }],
      );
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Text style={globalStyles.title}>Employee Registration</Text>
        <Text style={globalStyles.subtitle}>
          Please fill in all fields to register a new employee.
        </Text>

        <View style={globalStyles.card}>
          {/* Row: First & Last Name */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <FormInput
                label="First Name"
                placeholder="John"
                iconName="person-outline"
                value={formik.values.firstName}
                onChangeText={formik.handleChange("firstName")}
                onBlur={formik.handleBlur("firstName")}
                error={formik.errors.firstName}
                touched={formik.touched.firstName}
              />
            </View>
            <View style={styles.halfField}>
              <FormInput
                label="Last Name"
                placeholder="Doe"
                iconName="person-outline"
                value={formik.values.lastName}
                onChangeText={formik.handleChange("lastName")}
                onBlur={formik.handleBlur("lastName")}
                error={formik.errors.lastName}
                touched={formik.touched.lastName}
              />
            </View>
          </View>

          <FormInput
            label="Email Address"
            placeholder="john.doe@company.com"
            iconName="mail-outline"
            keyboardType="email-address"
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            error={formik.errors.email}
            touched={formik.touched.email}
          />

          <FormInput
            label="Phone Number"
            placeholder="4031234567"
            iconName="call-outline"
            keyboardType="phone-pad"
            value={formik.values.phone}
            onChangeText={formik.handleChange("phone")}
            onBlur={formik.handleBlur("phone")}
            error={formik.errors.phone}
            touched={formik.touched.phone}
          />

          <FormInput
            label="Department"
            placeholder="e.g. Engineering"
            iconName="business-outline"
            value={formik.values.department}
            onChangeText={formik.handleChange("department")}
            onBlur={formik.handleBlur("department")}
            error={formik.errors.department}
            touched={formik.touched.department}
          />

          <FormInput
            label="Job Title"
            placeholder="e.g. Software Developer"
            iconName="briefcase-outline"
            value={formik.values.jobTitle}
            onChangeText={formik.handleChange("jobTitle")}
            onBlur={formik.handleBlur("jobTitle")}
            error={formik.errors.jobTitle}
            touched={formik.touched.jobTitle}
          />

          <FormInput
            label="Employee ID"
            placeholder="e.g. EMP001"
            iconName="id-card-outline"
            autoCapitalize="characters"
            value={formik.values.employeeId}
            onChangeText={formik.handleChange("employeeId")}
            onBlur={formik.handleBlur("employeeId")}
            error={formik.errors.employeeId}
            touched={formik.touched.employeeId}
          />

          <SubmitButton
            title="Register Employee"
            onPress={formik.handleSubmit}
            disabled={!formik.isValid || !formik.dirty}
            loading={loading}
          />

          {/* Reset button */}
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  resetBtn: {
    backgroundColor: COLORS.textMuted,
    marginTop: 8,
    shadowOpacity: 0,
    elevation: 0,
  },
});
