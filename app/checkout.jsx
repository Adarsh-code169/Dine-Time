import { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import useCartStore from './store/cartStore';
import useAuthStore from './store/authStore';
import useOrdersStore from './store/ordersStore';
import { theme } from './constants/theme';

const PAYMENT_OPTIONS = [
    { key: 'cod', icon: 'money', label: 'Cash on Delivery' },
    { key: 'card', icon: 'credit-card', label: 'Credit / Debit Card' },
    { key: 'wallet', icon: 'mobile', label: 'Mobile Wallet' },
];

export default function Checkout() {
    const router = useRouter();
    const { cartItems, getTotalPrice, clearCart } = useCartStore();
    const { user, profile, addAddress } = useAuthStore();
    const { placeOrder } = useOrdersStore();

    const subtotal = getTotalPrice();
    const deliveryFee = subtotal > 0 ? 2.99 : 0;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + deliveryFee + tax).toFixed(2);

    const [selectedAddressId, setSelectedAddressId] = useState(
        profile?.addresses?.[0]?.id || null
    );
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [placing, setPlacing] = useState(false);
    const [addingNew, setAddingNew] = useState(!profile?.addresses?.length);
    const [newAddr, setNewAddr] = useState({ label: 'Home', line: '', city: '' });

    const addresses = profile?.addresses || [];

    const handleSaveNewAddress = async () => {
        if (!newAddr.line.trim() || !newAddr.city.trim()) {
            Toast.show({ type: 'error', text1: 'Please fill address fields' });
            return;
        }
        await addAddress(newAddr);
        const updated = useAuthStore.getState().profile?.addresses || [];
        const just = updated[updated.length - 1];
        setSelectedAddressId(just.id);
        setAddingNew(false);
        setNewAddr({ label: 'Home', line: '', city: '' });
        Toast.show({ type: 'success', text1: 'Address saved' });
    };

    const handlePlace = async () => {
        if (cartItems.length === 0) {
            Toast.show({ type: 'error', text1: 'Cart is empty' });
            return;
        }
        const address = addresses.find((a) => a.id === selectedAddressId) ||
            (addingNew ? newAddr : null);
        if (!address) {
            Toast.show({ type: 'error', text1: 'Add a delivery address' });
            return;
        }
        setPlacing(true);
        try {
            const order = await placeOrder({
                user,
                items: cartItems,
                address,
                paymentMethod,
                subtotal,
                deliveryFee,
                tax,
                total,
            });
            clearCart();
            Toast.show({ type: 'success', text1: 'Order placed!', text2: 'Track your delivery now' });
            router.replace({ pathname: '/order-tracking', params: { orderId: order.id } });
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Failed to place order', text2: e.message });
        } finally {
            setPlacing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <FontAwesome name="chevron-left" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Section title="Delivery Address" icon="map-marker">
                    {addresses.map((a) => (
                        <TouchableOpacity
                            key={a.id}
                            style={[styles.row, selectedAddressId === a.id && styles.rowActive]}
                            onPress={() => { setSelectedAddressId(a.id); setAddingNew(false); }}
                        >
                            <FontAwesome
                                name={selectedAddressId === a.id ? 'dot-circle-o' : 'circle-o'}
                                size={20}
                                color={selectedAddressId === a.id ? theme.colors.primary : theme.colors.textMuted}
                            />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.rowTitle}>{a.label}</Text>
                                <Text style={styles.rowSubtitle}>{a.line}, {a.city}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {addingNew ? (
                        <View style={styles.newAddressBlock}>
                            <View style={styles.labelPills}>
                                {['Home', 'Work', 'Other'].map((l) => (
                                    <TouchableOpacity
                                        key={l}
                                        onPress={() => setNewAddr({ ...newAddr, label: l })}
                                        style={[styles.pill, newAddr.label === l && styles.pillActive]}
                                    >
                                        <Text style={[styles.pillText, newAddr.label === l && styles.pillTextActive]}>{l}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                placeholder="Street, building, apt"
                                placeholderTextColor={theme.colors.textDim}
                                style={styles.input}
                                value={newAddr.line}
                                onChangeText={(t) => setNewAddr({ ...newAddr, line: t })}
                            />
                            <TextInput
                                placeholder="City"
                                placeholderTextColor={theme.colors.textDim}
                                style={styles.input}
                                value={newAddr.city}
                                onChangeText={(t) => setNewAddr({ ...newAddr, city: t })}
                            />
                            <TouchableOpacity onPress={handleSaveNewAddress} style={styles.saveBtn}>
                                <Text style={styles.saveBtnText}>Save address</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addRow}
                            onPress={() => setAddingNew(true)}
                        >
                            <FontAwesome name="plus" size={14} color={theme.colors.primary} />
                            <Text style={styles.addRowText}>Add new address</Text>
                        </TouchableOpacity>
                    )}
                </Section>

                <Section title="Payment Method" icon="credit-card">
                    {PAYMENT_OPTIONS.map((p) => (
                        <TouchableOpacity
                            key={p.key}
                            onPress={() => setPaymentMethod(p.key)}
                            style={[styles.row, paymentMethod === p.key && styles.rowActive]}
                        >
                            <FontAwesome
                                name={paymentMethod === p.key ? 'dot-circle-o' : 'circle-o'}
                                size={20}
                                color={paymentMethod === p.key ? theme.colors.primary : theme.colors.textMuted}
                            />
                            <FontAwesome name={p.icon} size={18} color="#fff" style={{ marginLeft: 12 }} />
                            <Text style={[styles.rowTitle, { marginLeft: 10 }]}>{p.label}</Text>
                        </TouchableOpacity>
                    ))}
                </Section>

                <Section title={`Items (${cartItems.length})`} icon="shopping-bag">
                    {cartItems.map((i) => (
                        <View key={`${i.restaurantId}-${i.menuItem.id}`} style={styles.cartRow}>
                            <View style={styles.qtyChip}><Text style={styles.qtyChipText}>{i.quantity}×</Text></View>
                            <Text style={styles.cartName} numberOfLines={1}>{i.menuItem.name}</Text>
                            <Text style={styles.cartPrice}>${(i.menuItem.price * i.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </Section>

                <View style={styles.summaryCard}>
                    <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                    <SummaryRow label="Delivery Fee" value={`$${deliveryFee.toFixed(2)}`} />
                    <SummaryRow label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
                    <View style={styles.divider} />
                    <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={handlePlace} disabled={placing} activeOpacity={0.85}>
                    <LinearGradient
                        colors={theme.gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.placeBtn}
                    >
                        {placing ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <>
                                <Text style={styles.placeBtnText}>Place Order · ${total.toFixed(2)}</Text>
                                <FontAwesome name="arrow-right" size={16} color="#000" style={{ marginLeft: 10 }} />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function Section({ title, icon, children }) {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <FontAwesome name={icon} size={14} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

function SummaryRow({ label, value, bold }) {
    return (
        <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, bold && styles.summaryBold]}>{label}</Text>
            <Text style={[styles.summaryValue, bold && styles.summaryBold]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    scrollContent: { padding: 16, paddingBottom: 140 },
    section: { marginBottom: 18 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
    sectionBody: { backgroundColor: theme.colors.surface, borderRadius: 14, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceElevated },
    rowActive: { backgroundColor: 'rgba(244,155,51,0.08)' },
    rowTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
    rowSubtitle: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    addRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
    addRowText: { color: theme.colors.primary, marginLeft: 10, fontWeight: '600' },
    newAddressBlock: { padding: 14 },
    labelPills: { flexDirection: 'row', marginBottom: 12 },
    pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: theme.colors.surfaceElevated, marginRight: 8 },
    pillActive: { backgroundColor: theme.colors.primary },
    pillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    pillTextActive: { color: '#000' },
    input: {
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: '#fff',
        marginBottom: 10,
    },
    saveBtn: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    saveBtnText: { color: '#000', fontWeight: 'bold' },
    cartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceElevated },
    qtyChip: { backgroundColor: theme.colors.surfaceElevated, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 12 },
    qtyChipText: { color: theme.colors.primary, fontSize: 12, fontWeight: 'bold' },
    cartName: { color: '#fff', flex: 1, fontSize: 14 },
    cartPrice: { color: theme.colors.textPrimary, fontWeight: 'bold' },
    summaryCard: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
    summaryLabel: { color: theme.colors.textMuted, fontSize: 14 },
    summaryValue: { color: '#fff', fontSize: 14 },
    summaryBold: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
    divider: { height: 1, backgroundColor: theme.colors.surfaceElevated, marginVertical: 10 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surface,
    },
    placeBtn: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.glow,
    },
    placeBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
