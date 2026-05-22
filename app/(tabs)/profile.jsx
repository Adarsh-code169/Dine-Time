import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useFavoritesStore from '../store/favoritesStore';
import useOrdersStore from '../store/ordersStore';
import { theme } from '../constants/theme';

export default function Profile() {
    const router = useRouter();
    const { user, profile, signOut } = useAuthStore();
    const orders = useOrdersStore((s) => s.orders);
    const favorites = useFavoritesStore((s) => s.favorites);
    const clearCart = useCartStore((s) => s.clearCart);

    const displayName = profile?.displayName || user?.displayName || 'Guest';
    const email = user?.email || (user?.isGuest ? 'Guest session' : '');
    const initials = (displayName || 'U').trim().slice(0, 2).toUpperCase();

    const menuItems = [
        { icon: 'user', label: 'Edit Profile', onPress: () => router.push('/edit-profile') },
        { icon: 'map-marker', label: 'Saved Addresses', onPress: () => router.push('/addresses') },
        { icon: 'shopping-bag', label: 'My Orders', onPress: () => router.push('/(tabs)/history') },
        { icon: 'heart', label: 'Favorites', onPress: () => router.push('/(tabs)/favorites') },
        { icon: 'bell', label: 'Notifications', onPress: () => Toast.show({ type: 'info', text1: 'Coming soon' }) },
        { icon: 'question-circle', label: 'Help & Support', onPress: () => Toast.show({ type: 'info', text1: 'Reach us at support@dinetime.app' }) },
    ];

    const handleLogout = () => {
        Alert.alert('Log out?', 'You will need to sign in again to access your account.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    clearCart();
                    router.replace('/');
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.userName}>{displayName}</Text>
                    {!!email && <Text style={styles.userEmail}>{email}</Text>}
                    {user?.isGuest && (
                        <TouchableOpacity onPress={() => router.push('/login')} style={styles.guestBanner}>
                            <Text style={styles.guestBannerText}>Sign in to save your data ➜</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statsRow}>
                    <Stat icon="shopping-bag" label="Orders" value={orders.length} />
                    <Stat icon="heart" label="Favorites" value={favorites.length} />
                    <Stat icon="map-marker" label="Addresses" value={profile?.addresses?.length || 0} />
                </View>

                <View style={styles.menuContainer}>
                    <View style={styles.menuCard}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={item.onPress}
                                style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
                            >
                                <View style={styles.menuIconContainer}>
                                    <FontAwesome name={item.icon} size={18} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <FontAwesome name="chevron-right" size={12} color={theme.colors.textDim} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <FontAwesome name="sign-out" size={20} color={theme.colors.danger} />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Stat({ icon, label, value }) {
    return (
        <View style={styles.statCard}>
            <FontAwesome name={icon} size={18} color={theme.colors.primary} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 30 },
    profileHeader: { alignItems: 'center', marginTop: 16, marginBottom: 16 },
    avatarContainer: {
        width: 92, height: 92, backgroundColor: theme.colors.primary, borderRadius: 46,
        alignItems: 'center', justifyContent: 'center', marginBottom: 14,
        borderWidth: 4, borderColor: theme.colors.surface, ...theme.shadows.glow,
    },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#000' },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    userEmail: { fontSize: 13, color: theme.colors.textMuted },
    guestBanner: { marginTop: 12, backgroundColor: 'rgba(244,155,51,0.12)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
    guestBannerText: { color: theme.colors.primary, fontSize: 12, fontWeight: '600' },
    statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, marginBottom: 24 },
    statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, backgroundColor: theme.colors.surface, marginHorizontal: 4, borderRadius: 14 },
    statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 8 },
    statLabel: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    menuContainer: { paddingHorizontal: 16 },
    menuCard: { backgroundColor: theme.colors.surface, borderRadius: 16, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
    menuItemBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceElevated },
    menuIconContainer: { width: 32, alignItems: 'center' },
    menuLabel: { flex: 1, color: '#fff', fontSize: 15, marginLeft: 12 },
    logoutButton: {
        marginTop: 24, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: theme.colors.danger,
        paddingVertical: 14, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    logoutText: { color: theme.colors.danger, fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
});
