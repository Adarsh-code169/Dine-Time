import { useEffect, useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/images/dinetimelogo.png';
import useAuthStore from './store/authStore';
import { theme } from './constants/theme';

const ONBOARDING_KEY = '@dinetime/onboarded';

export default function Index() {
    const router = useRouter();
    const { user, continueAsGuest } = useAuthStore();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
            if (!seen) {
                router.replace('/onboarding');
                return;
            }
            if (user) {
                router.replace('/(tabs)/home');
                return;
            }
            setReady(true);
        })();
    }, [user, router]);

    if (!ready) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={[theme.colors.background, '#0e0e0e']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.content}>
                <View style={styles.logoCircle}>
                    <Image source={logo} style={styles.logo} resizeMode="contain" />
                </View>
                <Text style={styles.brand}>Dine-Time</Text>
                <Text style={styles.tagline}>Where every craving meets its match.</Text>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        onPress={() => router.push('/login')}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={theme.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryButton}
                        >
                            <Text style={styles.primaryButtonText}>Sign In</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/signup')}
                        style={styles.secondaryButton}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.secondaryButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            continueAsGuest();
                            router.replace('/(tabs)/home');
                        }}
                        style={styles.guestButton}
                    >
                        <Text style={styles.guestButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loader: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
    logoCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(244,155,51,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(244,155,51,0.2)',
    },
    logo: { width: 150, height: 150 },
    brand: { color: '#fff', fontSize: 36, fontWeight: '800', letterSpacing: 0.5 },
    tagline: { color: theme.colors.textMuted, fontSize: 15, marginTop: 6, marginBottom: 48, textAlign: 'center' },
    buttons: { width: '100%' },
    primaryButton: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 14,
        ...theme.shadows.glow,
    },
    primaryButtonText: { color: '#000', fontSize: 17, fontWeight: 'bold' },
    secondaryButton: {
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        marginBottom: 14,
    },
    secondaryButtonText: { color: theme.colors.primary, fontSize: 17, fontWeight: 'bold' },
    guestButton: { paddingVertical: 12, alignItems: 'center' },
    guestButtonText: { color: theme.colors.textMuted, fontSize: 14 },
});
