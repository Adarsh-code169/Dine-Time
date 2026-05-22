import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import heroImage from '../assets/images/login_hero.png';
import useAuthStore from './store/authStore';
import { theme } from './constants/theme';

export default function Login() {
    const router = useRouter();
    const { signIn } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const next = {};
        if (!email.trim()) next.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email';
        if (!password) next.password = 'Password is required';
        else if (password.length < 6) next.password = 'Min 6 characters';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await signIn({ email, password });
            Toast.show({ type: 'success', text1: 'Welcome back!', text2: 'Login successful' });
            router.replace('/(tabs)/home');
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Login failed', text2: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.heroContainer}>
                        <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
                        <LinearGradient
                            colors={['transparent', 'rgba(26,26,26,0.6)', theme.colors.background]}
                            style={styles.heroOverlay}
                        />
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <FontAwesome name="chevron-left" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your delicious journey</Text>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={[styles.inputWrap, errors.email && styles.inputError]}>
                                    <FontAwesome name="envelope" size={16} color={theme.colors.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="you@example.com"
                                        placeholderTextColor={theme.colors.textDim}
                                        value={email}
                                        onChangeText={(t) => { setEmail(t); if (errors.email) setErrors({ ...errors, email: null }); }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={[styles.inputWrap, errors.password && styles.inputError]}>
                                    <FontAwesome name="lock" size={18} color={theme.colors.textMuted} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={theme.colors.textDim}
                                        value={password}
                                        onChangeText={(t) => { setPassword(t); if (errors.password) setErrors({ ...errors, password: null }); }}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                                        <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} color={theme.colors.textMuted} />
                                    </TouchableOpacity>
                                </View>
                                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            </View>

                            <TouchableOpacity
                                style={styles.forgotPassword}
                                onPress={() => router.push('/forgot-password')}
                            >
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                                <LinearGradient
                                    colors={theme.gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.signInButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#000" />
                                    ) : (
                                        <Text style={styles.signInButtonText}>Sign In</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={styles.footerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    heroContainer: { height: 280, width: '100%', position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: { ...StyleSheet.absoluteFillObject },
    backBtn: {
        position: 'absolute',
        top: 56,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        flex: 1,
        marginTop: -24,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 24,
    },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary },
    subtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: 6, marginBottom: 28 },
    form: { marginBottom: 8 },
    inputGroup: { marginBottom: 18 },
    label: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4 },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHigh,
    },
    inputError: { borderColor: theme.colors.danger },
    input: { flex: 1, color: theme.colors.textPrimary, fontSize: 16, paddingVertical: 14, marginLeft: 10 },
    errorText: { color: theme.colors.danger, fontSize: 12, marginTop: 6, marginLeft: 4 },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: 22 },
    forgotPasswordText: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
    signInButton: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        ...theme.shadows.glow,
    },
    signInButtonText: { color: '#000', fontSize: 17, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: theme.colors.textMuted, fontSize: 14 },
    footerLink: { color: theme.colors.primary, fontSize: 14, fontWeight: 'bold' },
});
