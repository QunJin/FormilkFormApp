// app/submissions.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/styles';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  employeeId: string;
  phone: string;
  createdAt: any;
  userId: string;
}

export default function SubmissionsScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    setError('');

    // Real-time listener — updates automatically when data changes
    const q = query(
      collection(db, 'employees'),
      where('userId', '==', user.uid),     // only this user's records
      orderBy('createdAt', 'desc'),         // newest first
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Employee[];
        setEmployees(data);
        setLoading(false);
        setRefreshing(false);
      },
      (err) => {
        console.error(err);
        setError('Failed to load submissions. Check your connection.');
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe; // cleanup listener
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    // onSnapshot will re-trigger automatically
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading submissions...</Text>
      </SafeAreaView>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={52} color={COLORS.error} />
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </SafeAreaView>
    );
  }

  // ─── Empty State ────────────────────────────────────────────────────────────
  if (employees.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="document-outline" size={64} color={COLORS.border} />
        <Text style={styles.emptyTitle}>No Submissions Yet</Text>
        <Text style={styles.emptyMessage}>Submit the Employee Form to see records here.</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/employee-form')}
        >
          <Text style={styles.addBtnText}>+ Add Employee</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─── List ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
        ListHeaderComponent={
          <Text style={styles.count}>{employees.length} record{employees.length !== 1 ? 's' : ''} found</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/submission-detail', params: { id: item.id } })}
            activeOpacity={0.85}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.firstName[0]}{item.lastName[0]}
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.detail}>{item.jobTitle} · {item.department}</Text>
              <Text style={styles.detail}>{item.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.fabBtn} onPress={() => router.push('/employee-form')}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.fabText}>Add Employee</Text>
          </TouchableOpacity>
        }
      />
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
  errorTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  errorMessage: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptyMessage: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 8 },
  addBtn: {
    marginTop: 24, backgroundColor: COLORS.primary,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  list: { padding: 20, paddingBottom: 40 },
  count: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 16,
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  cardBody: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  detail: { fontSize: 12, color: COLORS.textMuted, marginBottom: 1 },
  fabBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 14,
    padding: 14, marginTop: 8, gap: 6,
  },
  fabText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
