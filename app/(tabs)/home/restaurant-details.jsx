import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { restaurants } from '../../data/dummyData';
import MenuItem from '../../components/MenuItem';
import useCartStore from '../../store/cartStore';
import useFavoritesStore from '../../store/favoritesStore';
import { theme } from '../../constants/theme';

import burgerImg from '../../../assets/images/food_burger.png';
import pastaImg from '../../../assets/images/food_pasta.png';
import pizzaImg from '../../../assets/images/food_pizza.png';

const imageMap = { food_burger: burgerImg, food_pasta: pastaImg, food_pizza: pizzaImg };

export default function RestaurantDetails() {
    const router = useRouter();
    const { restaurantId } = useLocalSearchParams();
    const { addToCart, getCartCount } = useCartStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const [activeFilter, setActiveFilter] = useState('All');

    const restaurant = restaurants.find((r) => r.id === parseInt(restaurantId));

    if (!restaurant) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Restaurant not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.errBtn}>
                    <Text style={styles.errBtnText}>Go back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isFav = isFavorite(restaurant.id);
    const cartCount = getCartCount();

    const handleAddToCart = (menuItem) => {
        addToCart({
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            menuItem,
        });
        Toast.show({
            type: 'success',
            text1: 'Added to cart',
            text2: menuItem.name,
            visibilityTime: 1600,
        });
    };

    const filters = ['All', 'Popular', 'Mains', 'Sides'];

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroContainer}>
                    <Image source={imageMap[restaurant.image]} style={styles.heroImage} resizeMode="cover" />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.85)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <SafeAreaView style={styles.heroBar} edges={['top']}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                            <FontAwesome name="chevron-left" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleFavorite(restaurant.id)} style={styles.iconBtn}>
                            <FontAwesome name={isFav ? 'heart' : 'heart-o'} size={20} color={isFav ? theme.colors.danger : '#fff'} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.restaurantName}>{restaurant.name}</Text>
                            <Text style={styles.category}>{restaurant.category}</Text>
                        </View>
                        <View style={styles.ratingBadge}>
                            <FontAwesome name="star" size={12} color="#000" />
                            <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <FontAwesome name="clock-o" size={15} color={theme.colors.primary} />
                            <Text style={styles.metaText}>{restaurant.time}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <FontAwesome name="bicycle" size={15} color={theme.colors.primary} />
                            <Text style={styles.metaText}>{restaurant.deliveryFee}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <FontAwesome name="cutlery" size={14} color={theme.colors.primary} />
                            <Text style={styles.metaText}>{restaurant.menuItems.length} items</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>{restaurant.description}</Text>
                </View>

                <View style={styles.menuContainer}>
                    <Text style={styles.menuTitle}>Menu</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        {filters.map((f) => (
                            <TouchableOpacity
                                key={f}
                                onPress={() => setActiveFilter(f)}
                                style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
                            >
                                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {restaurant.menuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            imageSource={imageMap[item.image]}
                            onAddToCart={() => handleAddToCart(item)}
                        />
                    ))}
                </View>
            </ScrollView>

            {cartCount > 0 && (
                <View style={styles.cartFab}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} activeOpacity={0.85}>
                        <LinearGradient
                            colors={theme.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.cartFabInner}
                        >
                            <View style={styles.cartCountChip}>
                                <Text style={styles.cartCountText}>{cartCount}</Text>
                            </View>
                            <Text style={styles.cartFabText}>View Cart</Text>
                            <FontAwesome name="arrow-right" size={14} color="#000" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 110 },
    heroContainer: { height: 280, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
    iconBtn: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
    },
    infoContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    restaurantName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    category: { color: theme.colors.primary, fontSize: 14, marginTop: 4 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    ratingText: { fontWeight: 'bold', color: '#000', fontSize: 14, marginLeft: 4 },
    metaRow: { flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 18, marginTop: 4 },
    metaText: { color: theme.colors.textSecondary, fontSize: 13, marginLeft: 6 },
    description: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 4 },
    menuContainer: { padding: 16 },
    menuTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    filterScroll: { marginBottom: 14, marginHorizontal: -2 },
    filterPill: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: theme.colors.surface, borderRadius: 999, marginHorizontal: 4, borderWidth: 1, borderColor: theme.colors.surfaceElevated },
    filterPillActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    filterText: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '600' },
    filterTextActive: { color: '#000' },
    errorText: { color: '#fff', fontSize: 18, textAlign: 'center', marginTop: 60 },
    errBtn: { alignSelf: 'center', marginTop: 16, backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
    errBtnText: { color: '#000', fontWeight: 'bold' },
    cartFab: { position: 'absolute', bottom: 20, left: 16, right: 16 },
    cartFabInner: {
        flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 18,
        borderRadius: 14, alignItems: 'center', ...theme.shadows.glow,
    },
    cartCountChip: { backgroundColor: '#000', borderRadius: 999, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
    cartCountText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 12 },
    cartFabText: { flex: 1, color: '#000', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
