import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
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

export default function Addresses() {
    const router = useRouter();
    const { profile, addAddress, removeAddress } = useAuthStore();
    const addresses = profile?.addresses || [];
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ label: 'Home', line: '', city: '' });

    const handleSave = async () => {
        if (!form.line.trim() || !form.city.trim()) {
            Toast.show({ type: 'error', text1: 'Please fill all fields' });
            return;
        }
        await addAddress(form);
        Toast.show({ type: 'success', text1: 'Address added' });
        setForm({ label: 'Home', line: '', city: '' });
        setAdding(false);
    };

    const handleRemove = (id) => {
        Alert.alert('Remove address?', 'Are you sure you want to delete this address?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => removeAddress(id) },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <FontAwesome name="chevron-left" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Addresses</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {addresses.length === 0 && !adding && (
                        <View style={styles.empty}>
                            <FontAwesome name="map-marker" size={64} color={theme.colors.surfaceHigh} />
                            <Text style={styles.emptyTitle}>No addresses yet</Text>
                            <Text style={styles.emptySubtitle}>Add a delivery address to speed up checkout.</Text>
                        </View>
                    )}

                    {addresses.map((a) => (
                        <View key={a.id} style={styles.card}>
                            <View style={styles.cardIcon}>
                                <FontAwesome
                                    name={a.label === 'Home' ? 'home' : a.label === 'Work' ? 'briefcase' : 'map-marker'}
                                    size={18}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardLabel}>{a.label}</Text>
                                <Text style={styles.cardLine}>{a.line}</Text>
                                <Text style={styles.cardCity}>{a.city}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemove(a.id)} style={styles.deleteBtn}>
                                <FontAwesome name="trash" size={16} color={theme.colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {adding ? (
                        <View style={styles.formCard}>
                            <View style={styles.pills}>
                                {['Home', 'Work', 'Other'].map((l) => (
                                    <TouchableOpacity
                                        key={l}
                                        onPress={() => setForm({ ...form, label: l })}
                                        style={[styles.pill, form.label === l && styles.pillActive]}
                                    >
                                        <Text style={[styles.pillText, form.label === l && styles.pillTextActive]}>{l}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Street, building, apt"
                                placeholderTextColor={theme.colors.textDim}
                                value={form.line}
                                onChangeText={(t) => setForm({ ...form, line: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="City"
                                placeholderTextColor={theme.colors.textDim}
                                value={form.city}
                                onChangeText={(t) => setForm({ ...form, city: t })}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => setAdding(false)} style={[styles.actionBtn, styles.cancelBtn]}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave} style={[styles.actionBtn, styles.saveBtn]}>
                                    <Text style={styles.saveText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setAdding(true)} activeOpacity={0.85}>
                            <LinearGradient
                                colors={theme.gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.addBtn}
                            >
                                <FontAwesome name="plus" size={14} color="#000" />
                                <Text style={styles.addBtnText}>  Add new address</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    empty: { alignItems: 'center', paddingVertical: 50 },
    emptyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 16 },
    emptySubtitle: { color: theme.colors.textMuted, fontSize: 14, marginTop: 6, textAlign: 'center' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14, marginBottom: 12 },
    cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(244,155,51,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    cardLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    cardLine: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
    cardCity: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    deleteBtn: { padding: 10 },
    formCard: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, marginTop: 12 },
    pills: { flexDirection: 'row', marginBottom: 12 },
    pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: theme.colors.surfaceElevated, marginRight: 8 },
    pillActive: { backgroundColor: theme.colors.primary },
    pillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    pillTextActive: { color: '#000' },
    input: { backgroundColor: theme.colors.surfaceElevated, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, color: '#fff', marginBottom: 10 },
    actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
    cancelBtn: { backgroundColor: theme.colors.surfaceElevated },
    cancelText: { color: '#fff', fontWeight: '600' },
    saveBtn: { backgroundColor: theme.colors.primary },
    saveText: { color: '#000', fontWeight: 'bold' },
    addBtn: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, ...theme.shadows.glow },
    addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});
