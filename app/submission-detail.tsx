// app/submission-detail.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { COLORS } from '../constants/styles';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  employeeId: string;
  createdAt: any;
}

// ─── Detail Row Component ─────────────────────────────────────────────────────
const DetailRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
    </View>
    <View style={styles.detailText}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

export default function SubmissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, 'employees', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmployee({ id: docSnap.id, ...docSnap.data() } as Employee);
        } else {
          setError('Record not found.');
        }
      } catch (err) {
        setError('Failed to load record. Check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      '🗑️ Delete Record',
      `Are you sure you want to delete ${employee?.firstName} ${employee?.lastName}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteDoc(doc(db, 'employees', id));
              Alert.alert('Deleted', 'Record has been removed.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (err) {
              Alert.alert('Error', 'Could not delete record. Try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading record...</Text>
      </SafeAreaView>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error || !employee) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={52} color={COLORS.error} />
        <Text style={styles.errorText}>{error || 'Record not found.'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─── Detail View ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar Header */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee.firstName[0]}{employee.lastName[0]}
            </Text>
          </View>
          <Text style={styles.fullName}>{employee.firstName} {employee.lastName}</Text>
          <Text style={styles.jobTitle}>{employee.jobTitle}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{employee.department}</Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Employee Details</Text>
          <DetailRow icon="id-card-outline" label="Employee ID" value={employee.employeeId} />
          <DetailRow icon="mail-outline" label="Email" value={employee.email} />
          <DetailRow icon="call-outline" label="Phone" value={employee.phone} />
          <DetailRow icon="business-outline" label="Department" value={employee.department} />
          <DetailRow icon="briefcase-outline" label="Job Title" value={employee.jobTitle} />
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push({ pathname: '/edit-employee', params: { id } })}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={18} color={COLORS.white} />
          <Text style={styles.editBtnText}>Edit Record</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          disabled={deleting}
          activeOpacity={0.8}
        >
          {deleting ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color={COLORS.white} />
              <Text style={styles.deleteBtnText}>Delete Record</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 32, backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 12, color: COLORS.textMuted, fontSize: 15 },
  errorText: { fontSize: 16, color: COLORS.error, textAlign: 'center', marginTop: 12 },
  backBtn: {
    marginTop: 20, backgroundColor: COLORS.primary,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  backBtnText: { color: COLORS.white, fontWeight: '700' },
  container: { padding: 24, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: COLORS.white },
  fullName: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  jobTitle: { fontSize: 15, color: COLORS.textMuted, marginBottom: 10 },
  badge: {
    backgroundColor: COLORS.primary + '18',
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20,
  },
  badgeText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  detailIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 14,
    padding: 16, gap: 8, marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  editBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.error, borderRadius: 14,
    padding: 16, gap: 8,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  deleteBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
