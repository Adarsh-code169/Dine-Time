import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import useCartStore from '../store/cartStore';

// Import images
import burgerImg from '../../assets/images/food_burger.png';
import pastaImg from '../../assets/images/food_pasta.png';
import pizzaImg from '../../assets/images/food_pizza.png';

const imageMap = {
    food_burger: burgerImg,
    food_pasta: pastaImg,
    food_pizza: pizzaImg,
};

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
    const totalPrice = getTotalPrice();

    const handleIncrease = (restaurantId, menuItemId, currentQuantity) => {
        updateQuantity(restaurantId, menuItemId, currentQuantity + 1);
    };

    const handleDecrease = (restaurantId, menuItemId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(restaurantId, menuItemId, currentQuantity - 1);
        } else {
            removeFromCart(restaurantId, menuItemId);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
                {cartItems.length > 0 && (
                    <TouchableOpacity onPress={clearCart}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="shopping-cart" size={80} color="#666" />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <Text style={styles.emptySubtext}>Add items from restaurants to get started</Text>
                </View>
            ) : (
                <>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {cartItems.map((item, index) => (
                            <View key={`${item.restaurantId}-${item.menuItem.id}`} style={styles.cartItem}>
                                <Image
                                    source={imageMap[item.menuItem.image]}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.menuItem.name}</Text>
                                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                                    <Text style={styles.itemPrice}>${item.menuItem.price.toFixed(2)}</Text>
                                </View>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        onPress={() => handleDecrease(item.restaurantId, item.menuItem.id, item.quantity)}
                                        style={styles.quantityButton}
                                    >
                                        <FontAwesome name="minus" size={12} color="#fff" />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleIncrease(item.restaurantId, item.menuItem.id, item.quantity)}
                                        style={styles.quantityButton}
                                    >
                                        <FontAwesome name="plus" size={12} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeFromCart(item.restaurantId, item.menuItem.id)}
                                    style={styles.removeButton}
                                >
                                    <FontAwesome name="trash" size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Checkout Section */}
                    <View style={styles.checkoutContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Delivery Fee</Text>
                            <Text style={styles.totalValue}>$2.99</Text>
                        </View>
                        <View style={[styles.totalRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalValue}>${(totalPrice + 2.99).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton}>
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                            <FontAwesome name="arrow-right" size={16} color="#000" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2b2b2b',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3b3b3b',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    clearText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
    },
    emptySubtext: {
        color: '#9ca3af',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    cartItem: {
        backgroundColor: '#3b3b3b',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#4b5563',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    restaurantName: {
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 2,
    },
    itemPrice: {
        color: '#f49b33',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        borderRadius: 8,
        padding: 4,
        marginRight: 8,
    },
    quantityButton: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f49b33',
        borderRadius: 4,
    },
    quantityText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
    },
    checkoutContainer: {
        backgroundColor: '#3b3b3b',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    totalLabel: {
        color: '#9ca3af',
        fontSize: 14,
    },
    totalValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    grandTotalRow: {
        borderTopWidth: 1,
        borderTopColor: '#4b5563',
        paddingTop: 12,
        marginTop: 4,
        marginBottom: 16,
    },
    grandTotalLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    grandTotalValue: {
        color: '#f49b33',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#f49b33',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkoutButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
