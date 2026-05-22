import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import useAuthStore from './store/authStore';
import { theme } from './constants/theme';

export default function ForgotPassword() {
    const router = useRouter();
    const { resetPassword } = useAuthStore();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            Toast.show({ type: 'error', text1: 'Enter a valid email' });
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email);
            setSent(true);
            Toast.show({ type: 'success', text1: 'Reset link sent', text2: 'Check your inbox' });
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Failed', text2: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="chevron-left" size={18} color="#fff" />
                </TouchableOpacity>
                <View style={styles.inner}>
                    <View style={styles.iconCircle}>
                        <FontAwesome name="lock" size={36} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.title}>{sent ? 'Check Your Email' : 'Forgot Password'}</Text>
                    <Text style={styles.subtitle}>
                        {sent
                            ? `We sent a reset link to ${email}`
                            : 'Enter your email and we’ll send you a link to reset your password.'}
                    </Text>

                    {!sent && (
                        <>
                            <View style={styles.inputWrap}>
                                <FontAwesome name="envelope" size={16} color={theme.colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor={theme.colors.textDim}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            <TouchableOpacity onPress={handleSend} disabled={loading} activeOpacity={0.85}>
                                <LinearGradient
                                    colors={theme.gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.btn}
                                >
                                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    )}

                    {sent && (
                        <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.85}>
                            <LinearGradient colors={theme.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
                                <Text style={styles.btnText}>Back to Login</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 24 },
    backBtn: {
        marginTop: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inner: { flex: 1, justifyContent: 'center', paddingBottom: 80 },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(244,155,51,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 24,
    },
    title: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: theme.colors.textMuted, fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHigh,
        marginBottom: 20,
    },
    input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14, marginLeft: 10 },
    btn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', ...theme.shadows.glow },
    btnText: { color: '#000', fontSize: 17, fontWeight: 'bold' },
});
