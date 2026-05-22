import { useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useOrdersStore from './store/ordersStore';
import { theme, ORDER_STATUSES, ORDER_STATUS_LABELS } from './constants/theme';

const STATUS_ICONS = {
    placed: 'check-circle',
    preparing: 'cutlery',
    on_the_way: 'motorcycle',
    delivered: 'home',
};

export default function OrderTracking() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();
    const order = useOrdersStore((s) => s.orders.find((o) => o.id === orderId));
    const pulse = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, [pulse]);

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.notFound}>Order not found</Text>
                <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.homeBtn}>
                    <Text style={styles.homeBtnText}>Back to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentIdx = ORDER_STATUSES.indexOf(order.status);
    const isDelivered = order.status === 'delivered';

    const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
    const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.iconBtn}>
                    <FontAwesome name="chevron-left" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Tracking</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroCard}>
                    <LinearGradient
                        colors={['#f49b33', '#ff7e3d']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroBg}
                    />
                    <View style={styles.iconRingWrap}>
                        <Animated.View style={[styles.iconRingPulse, { transform: [{ scale }], opacity }]} />
                        <View style={styles.iconRing}>
                            <FontAwesome name={STATUS_ICONS[order.status]} size={36} color="#000" />
                        </View>
                    </View>
                    <Text style={styles.statusLabel}>{ORDER_STATUS_LABELS[order.status]}</Text>
                    <Text style={styles.statusSub}>
                        {isDelivered ? 'Enjoy your meal!' : 'Estimated arrival in 25–35 min'}
                    </Text>
                </View>

                <View style={styles.stepper}>
                    {ORDER_STATUSES.map((s, idx) => {
                        const done = idx <= currentIdx;
                        return (
                            <View key={s} style={styles.stepRow}>
                                <View style={styles.stepLeft}>
                                    <View style={[styles.stepDot, done && styles.stepDotDone]}>
                                        {done && <FontAwesome name="check" size={10} color="#000" />}
                                    </View>
                                    {idx < ORDER_STATUSES.length - 1 && (
                                        <View style={[styles.stepLine, done && styles.stepLineDone]} />
                                    )}
                                </View>
                                <View style={styles.stepBody}>
                                    <Text style={[styles.stepTitle, done && styles.stepTitleDone]}>
                                        {ORDER_STATUS_LABELS[s]}
                                    </Text>
                                    <Text style={styles.stepHint}>
                                        {idx === 0 && 'We received your order'}
                                        {idx === 1 && 'The restaurant is preparing your food'}
                                        {idx === 2 && 'Your rider is on the way'}
                                        {idx === 3 && 'Delivered to your address'}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Order Summary</Text>
                    {order.items.map((it, idx) => (
                        <View key={idx} style={styles.itemRow}>
                            <Text style={styles.itemName} numberOfLines={1}>{it.quantity}× {it.name}</Text>
                            <Text style={styles.itemPrice}>${(it.price * it.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <Row label="Subtotal" value={`$${(order.subtotal ?? 0).toFixed(2)}`} />
                    <Row label="Delivery" value={`$${(order.deliveryFee ?? 0).toFixed(2)}`} />
                    <Row label="Tax" value={`$${(order.tax ?? 0).toFixed(2)}`} />
                    <Row label="Total" value={`$${(order.total ?? 0).toFixed(2)}`} bold />
                </View>

                {order.address && (
                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsTitle}>Delivery to</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="map-marker" size={20} color={theme.colors.primary} />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.itemName}>{order.address.label}</Text>
                                <Text style={styles.stepHint}>{order.address.line}, {order.address.city}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {isDelivered && (
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} activeOpacity={0.85}>
                        <LinearGradient
                            colors={theme.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.doneBtn}
                        >
                            <Text style={styles.doneBtnText}>Order Again</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function Row({ label, value, bold }) {
    return (
        <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, bold && styles.summaryBold]}>{label}</Text>
            <Text style={[styles.summaryValue, bold && styles.summaryBold]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    scrollContent: { padding: 16, paddingBottom: 30 },
    notFound: { color: '#fff', textAlign: 'center', marginTop: 40, fontSize: 16 },
    homeBtn: { alignSelf: 'center', marginTop: 20, backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    homeBtnText: { color: '#000', fontWeight: 'bold' },
    heroCard: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden',
        ...theme.shadows.glow,
    },
    heroBg: { ...StyleSheet.absoluteFillObject },
    iconRingWrap: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    iconRingPulse: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
    },
    iconRing: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusLabel: { color: '#000', fontSize: 22, fontWeight: 'bold' },
    statusSub: { color: 'rgba(0,0,0,0.7)', fontSize: 13, marginTop: 4 },
    stepper: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 18, marginBottom: 16 },
    stepRow: { flexDirection: 'row', minHeight: 60 },
    stepLeft: { width: 28, alignItems: 'center' },
    stepDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: theme.colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
    stepDotDone: { backgroundColor: theme.colors.primary },
    stepLine: { width: 2, flex: 1, backgroundColor: theme.colors.surfaceHigh, marginTop: 2 },
    stepLineDone: { backgroundColor: theme.colors.primary },
    stepBody: { flex: 1, paddingLeft: 12, paddingBottom: 18 },
    stepTitle: { color: theme.colors.textMuted, fontSize: 15, fontWeight: '600' },
    stepTitleDone: { color: '#fff' },
    stepHint: { color: theme.colors.textDim, fontSize: 12, marginTop: 2 },
    detailsCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 16 },
    detailsTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    itemName: { color: '#fff', flex: 1, marginRight: 12 },
    itemPrice: { color: theme.colors.primary, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: theme.colors.surfaceElevated, marginVertical: 10 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
    summaryLabel: { color: theme.colors.textMuted, fontSize: 14 },
    summaryValue: { color: '#fff', fontSize: 14 },
    summaryBold: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
    doneBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8, ...theme.shadows.glow },
    doneBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
