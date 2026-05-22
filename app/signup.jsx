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
import logo from '../assets/images/dinetimelogo.png';
import useAuthStore from './store/authStore';
import { theme } from './constants/theme';

export default function Signup() {
    const router = useRouter();
    const { signUp } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const next = {};
        if (!name.trim()) next.name = 'Name is required';
        if (!email.trim()) next.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email';
        if (!password) next.password = 'Password is required';
        else if (password.length < 6) next.password = 'Min 6 characters';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSignup = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await signUp({ name: name.trim(), email, password });
            Toast.show({ type: 'success', text1: 'Account created!', text2: 'Welcome to Dine-Time' });
            router.replace('/(tabs)/home');
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Sign up failed', text2: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <FontAwesome name="chevron-left" size={18} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Image source={logo} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us for the best dining experience</Text>
                    </View>

                    <View style={styles.form}>
                        <Field
                            label="Full Name"
                            icon="user"
                            value={name}
                            onChangeText={(t) => { setName(t); if (errors.name) setErrors({ ...errors, name: null }); }}
                            placeholder="John Doe"
                            error={errors.name}
                        />
                        <Field
                            label="Email Address"
                            icon="envelope"
                            value={email}
                            onChangeText={(t) => { setEmail(t); if (errors.email) setErrors({ ...errors, email: null }); }}
                            placeholder="you@example.com"
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Field
                            label="Password"
                            icon="lock"
                            value={password}
                            onChangeText={(t) => { setPassword(t); if (errors.password) setErrors({ ...errors, password: null }); }}
                            placeholder="At least 6 characters"
                            error={errors.password}
                            secureTextEntry={!showPassword}
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                                    <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} color={theme.colors.textMuted} />
                                </TouchableOpacity>
                            }
                        />

                        <TouchableOpacity onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
                            <LinearGradient
                                colors={theme.gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.signUpButton}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function Field({ label, icon, error, rightIcon, ...inputProps }) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrap, error && styles.inputError]}>
                <FontAwesome name={icon} size={16} color={theme.colors.textMuted} />
                <TextInput
                    style={styles.input}
                    placeholderTextColor={theme.colors.textDim}
                    autoCorrect={false}
                    {...inputProps}
                />
                {rightIcon}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
    backBtn: {
        marginTop: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: { alignItems: 'center', marginTop: 16, marginBottom: 28 },
    logo: { width: 90, height: 90, marginBottom: 14 },
    title: { fontSize: 26, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 6 },
    subtitle: { fontSize: 14, color: theme.colors.textMuted },
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
    signUpButton: {
        marginTop: 10,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        ...theme.shadows.glow,
    },
    signUpButtonText: { color: '#000', fontSize: 17, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: theme.colors.textMuted, fontSize: 14 },
    footerLink: { color: theme.colors.primary, fontSize: 14, fontWeight: 'bold' },
});
