import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useOrdersStore from '../store/ordersStore';
import { theme, ORDER_STATUS_LABELS } from '../constants/theme';

import burgerImg from '../../assets/images/food_burger.png';
import pastaImg from '../../assets/images/food_pasta.png';
import pizzaImg from '../../assets/images/food_pizza.png';

const imageMap = { food_burger: burgerImg, food_pasta: pastaImg, food_pizza: pizzaImg };

function formatDate(dateInput) {
    if (!dateInput) return '';
    let d;
    if (typeof dateInput === 'object' && dateInput.toDate) d = dateInput.toDate();
    else d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
}

function statusColor(status) {
    if (status === 'delivered') return theme.colors.success;
    if (status === 'on_the_way') return theme.colors.info;
    if (status === 'preparing') return theme.colors.warning;
    return theme.colors.primary;
}

export default function History() {
    const router = useRouter();
    const orders = useOrdersStore((s) => s.orders);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Order History</Text>
            </View>

            {orders.length === 0 ? (
                <View style={styles.empty}>
                    <View style={styles.emptyIcon}>
                        <FontAwesome name="clock-o" size={56} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>No orders yet</Text>
                    <Text style={styles.emptySubtitle}>Your past orders will appear here.</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.browseBtn}>
                        <Text style={styles.browseBtnText}>Start Ordering</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const img = imageMap[item.restaurantImage] || burgerImg;
                        const itemSummary = item.items
                            ?.map((i) => `${i.quantity}× ${i.name}`)
                            .join(', ');
                        return (
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/order-tracking', params: { orderId: item.id } })}
                                style={styles.orderCard}
                                activeOpacity={0.85}
                            >
                                <Image source={img} style={styles.orderImage} />
                                <View style={styles.orderInfo}>
                                    <View style={styles.orderHeader}>
                                        <Text style={styles.restaurantName} numberOfLines={1}>{item.restaurantName || 'Order'}</Text>
                                        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                                    </View>
                                    <Text style={styles.orderItems} numberOfLines={1}>{itemSummary}</Text>
                                    <View style={styles.orderFooter}>
                                        <Text style={styles.orderPrice}>${(item.total ?? 0).toFixed(2)}</Text>
                                        <View style={[styles.statusPill, { backgroundColor: `${statusColor(item.status)}22`, borderColor: statusColor(item.status) }]}>
                                            <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
                                            <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                                                {ORDER_STATUS_LABELS[item.status] || item.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: theme.colors.surface,
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    listContent: { padding: 16 },
    orderCard: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14, marginBottom: 14, flexDirection: 'row' },
    orderImage: { width: 70, height: 70, borderRadius: 10, backgroundColor: theme.colors.surfaceHigh },
    orderInfo: { marginLeft: 14, flex: 1, justifyContent: 'space-between' },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    restaurantName: { color: '#fff', fontWeight: 'bold', fontSize: 15, flex: 1, marginRight: 8 },
    orderDate: { color: theme.colors.textMuted, fontSize: 11 },
    orderItems: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4 },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    orderPrice: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 15 },
    statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    statusText: { fontSize: 11, fontWeight: '700' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    emptyIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(244,155,51,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
    emptyTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    emptySubtitle: { color: theme.colors.textMuted, fontSize: 14, marginTop: 6, textAlign: 'center' },
    browseBtn: { marginTop: 24, backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    browseBtnText: { color: '#000', fontWeight: 'bold' },
});
