// app/profile.tsx
import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/styles';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Get initials from email (e.g. "john@test.com" → "J")
  const initials = user?.email?.charAt(0).toUpperCase() ?? '?';

  // Format the account creation date
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Unknown';

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.emailText}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✅ Verified Account</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Info</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{createdAt}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="finger-print-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{user?.uid}</Text>
            </View>
          </View>
        </View>

        {/* Actions Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/forgot-password')}
          >
            <View style={styles.infoIcon}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/submissions')}
          >
            <View style={styles.infoIcon}>
              <Ionicons name="list-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>My Submissions</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 24, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 28, marginTop: 8 },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: COLORS.white },
  emailText: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  badge: {
    backgroundColor: '#DCFCE7', paddingHorizontal: 14,
    paddingVertical: 5, borderRadius: 20,
  },
  badgeText: { color: '#16A34A', fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.textMuted,
    marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  actionText: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text, marginLeft: 12 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.error, borderRadius: 14,
    padding: 16, gap: 8,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  signOutText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
