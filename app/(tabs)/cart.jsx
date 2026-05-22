import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import useCartStore from '../store/cartStore';
import { theme } from '../constants/theme';

import burgerImg from '../../assets/images/food_burger.png';
import pastaImg from '../../assets/images/food_pasta.png';
import pizzaImg from '../../assets/images/food_pizza.png';

const imageMap = { food_burger: burgerImg, food_pasta: pastaImg, food_pizza: pizzaImg };

export default function Cart() {
    const router = useRouter();
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
    const subtotal = getTotalPrice();
    const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + deliveryFee + tax).toFixed(2);

    const confirmClear = () => {
        Alert.alert('Clear cart?', 'Remove all items from your cart?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
                {cartItems.length > 0 && (
                    <TouchableOpacity onPress={confirmClear}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <FontAwesome name="shopping-cart" size={56} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <Text style={styles.emptySubtext}>Add items from restaurants to get started</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home')} activeOpacity={0.85} style={{ marginTop: 24 }}>
                        <LinearGradient
                            colors={theme.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.browseBtn}
                        >
                            <Text style={styles.browseBtnText}>Browse Restaurants</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {cartItems.map((item) => (
                            <View key={`${item.restaurantId}-${item.menuItem.id}`} style={styles.cartItem}>
                                <Image source={imageMap[item.menuItem.image]} style={styles.itemImage} resizeMode="cover" />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.menuItem.name}</Text>
                                    <Text style={styles.restaurantName} numberOfLines={1}>{item.restaurantName}</Text>
                                    <Text style={styles.itemPrice}>${item.menuItem.price.toFixed(2)}</Text>
                                </View>
                                <View style={styles.controls}>
                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                updateQuantity(item.restaurantId, item.menuItem.id, item.quantity - 1)
                                            }
                                            style={styles.quantityButton}
                                        >
                                            <FontAwesome name="minus" size={11} color="#000" />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                updateQuantity(item.restaurantId, item.menuItem.id, item.quantity + 1)
                                            }
                                            style={styles.quantityButton}
                                        >
                                            <FontAwesome name="plus" size={11} color="#000" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => removeFromCart(item.restaurantId, item.menuItem.id)}
                                        style={styles.removeButton}
                                    >
                                        <FontAwesome name="trash" size={14} color={theme.colors.danger} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.checkoutContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Delivery</Text>
                            <Text style={styles.totalValue}>${deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tax (8%)</Text>
                            <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.totalRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/checkout')} activeOpacity={0.85}>
                            <LinearGradient
                                colors={theme.gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.checkoutButton}
                            >
                                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                                <FontAwesome name="arrow-right" size={14} color="#000" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: theme.colors.surface,
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    clearText: { color: theme.colors.danger, fontSize: 14, fontWeight: '600' },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    emptyIcon: {
        width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(244,155,51,0.1)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    },
    emptyText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    emptySubtext: { color: theme.colors.textMuted, fontSize: 14, marginTop: 8, textAlign: 'center' },
    browseBtn: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, ...theme.shadows.glow },
    browseBtnText: { color: '#000', fontWeight: 'bold' },
    scrollContent: { padding: 16, paddingBottom: 20 },
    cartItem: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
    itemImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: theme.colors.surfaceHigh },
    itemInfo: { flex: 1, marginLeft: 12 },
    itemName: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    restaurantName: { color: theme.colors.textMuted, fontSize: 11, marginTop: 2 },
    itemPrice: { color: theme.colors.primary, fontSize: 14, fontWeight: 'bold', marginTop: 4 },
    controls: { alignItems: 'flex-end' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, borderRadius: 6 },
    quantityText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginHorizontal: 10, minWidth: 18, textAlign: 'center' },
    removeButton: { padding: 6, marginTop: 4 },
    checkoutContainer: { backgroundColor: theme.colors.surface, padding: 16, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    totalLabel: { color: theme.colors.textMuted, fontSize: 14 },
    totalValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
    grandTotalRow: { borderTopWidth: 1, borderTopColor: theme.colors.surfaceHigh, paddingTop: 12, marginTop: 4, marginBottom: 14 },
    grandTotalLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    grandTotalValue: { color: theme.colors.primary, fontSize: 18, fontWeight: 'bold' },
    checkoutButton: {
        flexDirection: 'row', paddingVertical: 16, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center', ...theme.shadows.glow,
    },
    checkoutButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
});
