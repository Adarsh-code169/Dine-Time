import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import useAuthStore from './store/authStore';
import useOrdersStore from './store/ordersStore';
import { theme } from './constants/theme';
import '../global.css';

function useProtectedRoute() {
    const segments = useSegments();
    const router = useRouter();
    const { user, initializing } = useAuthStore();

    useEffect(() => {
        if (initializing) return;
        const first = segments[0];
        const inAuthGroup = first === '(tabs)';
        if (!user && inAuthGroup) {
            router.replace('/');
        }
    }, [user, segments, initializing, router]);
}

export default function RootLayout() {
    const { init, user } = useAuthStore();
    const { subscribeToUserOrders, unsubscribeOrders } = useOrdersStore();

    useEffect(() => {
        const unsub = init();
        return () => {
            if (typeof unsub === 'function') unsub();
        };
    }, [init]);

    useEffect(() => {
        if (user && !user.isGuest) {
            subscribeToUserOrders(user.uid);
        }
        return () => unsubscribeOrders();
    }, [user, subscribeToUserOrders, unsubscribeOrders]);

    useProtectedRoute();

    const { initializing } = useAuthStore();
    if (initializing) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="forgot-password" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="order-tracking" />
                <Stack.Screen name="edit-profile" />
                <Stack.Screen name="addresses" />
            </Stack>
            <Toast position="top" topOffset={60} />
        </>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
