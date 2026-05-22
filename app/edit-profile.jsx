import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import useAuthStore from './store/authStore';
import { theme } from './constants/theme';

export default function EditProfile() {
    const router = useRouter();
    const { user, profile, updateProfileData } = useAuthStore();
    const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
    const [phone, setPhone] = useState(profile?.phone || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [saving, setSaving] = useState(false);

    const initials = (displayName || 'U').trim().slice(0, 2).toUpperCase();

    const handleSave = async () => {
        if (!displayName.trim()) {
            Toast.show({ type: 'error', text1: 'Name is required' });
            return;
        }
        setSaving(true);
        try {
            await updateProfileData({ displayName: displayName.trim(), phone: phone.trim(), bio: bio.trim() });
            Toast.show({ type: 'success', text1: 'Profile updated' });
            router.back();
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Update failed', text2: e.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <FontAwesome name="chevron-left" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.avatarSection}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <Text style={styles.emailHint}>{user?.email || 'Guest user'}</Text>
                    </View>

                    <Field label="Display Name" icon="user" value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
                    <Field label="Phone" icon="phone" value={phone} onChangeText={setPhone} placeholder="+1 555 123 4567" keyboardType="phone-pad" />
                    <Field label="About You" icon="info-circle" value={bio} onChangeText={setBio} placeholder="Tell us a bit about you..." multiline />

                    <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.85}>
                        <LinearGradient
                            colors={theme.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveBtn}
                        >
                            {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function Field({ label, icon, multiline, ...rest }) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={[styles.fieldWrap, multiline && { alignItems: 'flex-start', paddingTop: 12 }]}>
                <FontAwesome name={icon} size={16} color={theme.colors.textMuted} style={multiline ? { marginTop: 4 } : null} />
                <TextInput
                    style={[styles.fieldInput, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
                    placeholderTextColor={theme.colors.textDim}
                    multiline={multiline}
                    {...rest}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    avatarSection: { alignItems: 'center', marginTop: 12, marginBottom: 28 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        ...theme.shadows.glow,
    },
    avatarText: { fontSize: 36, fontWeight: 'bold', color: '#000' },
    emailHint: { color: theme.colors.textMuted, fontSize: 14 },
    fieldGroup: { marginBottom: 18 },
    fieldLabel: { color: theme.colors.textSecondary, fontSize: 13, marginBottom: 8, marginLeft: 4 },
    fieldWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHigh,
    },
    fieldInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14, marginLeft: 10 },
    saveBtn: { marginTop: 12, paddingVertical: 16, borderRadius: 14, alignItems: 'center', ...theme.shadows.glow },
    saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
