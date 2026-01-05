import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const menuItems = [
    { icon: 'user', label: 'Edit Profile' },
    { icon: 'map-marker', label: 'Saved Addresses' },
    { icon: 'credit-card', label: 'Payment Methods' },
    { icon: 'bell', label: 'Notifications' },
    { icon: 'question-circle', label: 'Help & Support' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        <View style={styles.menuContainer}>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
              >
                <View style={styles.menuIconContainer}>
                  <FontAwesome name={item.icon} size={20} color="#f49b33" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <FontAwesome name="chevron-right" size={14} color="#666" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => router.replace('/')}
            style={styles.logoutButton}
          >
            <FontAwesome name="sign-out" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2b2b',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#f49b33',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#3b3b3b',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#9ca3af',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuCard: {
    backgroundColor: '#3b3b3b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
  },
  menuIconContainer: {
    width: 32,
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});