import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { restaurants } from '../data/dummyData';
import RestaurantCard from '../components/RestaurantCard';
import useFavoritesStore from '../store/favoritesStore';
import { theme } from '../constants/theme';

import burgerImg from '../../assets/images/food_burger.png';
import pastaImg from '../../assets/images/food_pasta.png';
import pizzaImg from '../../assets/images/food_pizza.png';

const imageMap = { food_burger: burgerImg, food_pasta: pastaImg, food_pizza: pizzaImg };

export default function Favorites() {
    const router = useRouter();
    const { favorites } = useFavoritesStore();

    const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Favorites</Text>
                <Text style={styles.countLabel}>{favoriteRestaurants.length}</Text>
            </View>

            {favoriteRestaurants.length === 0 ? (
                <View style={styles.empty}>
                    <View style={styles.emptyIcon}>
                        <FontAwesome name="heart-o" size={56} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>No favorites yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap the heart icon on restaurants to save them here.
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.browseBtn}>
                        <Text style={styles.browseBtnText}>Discover Restaurants</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {favoriteRestaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            imageSource={imageMap[restaurant.image]}
                            onPress={() =>
                                router.push({
                                    pathname: '/(tabs)/home/restaurant-details',
                                    params: { restaurantId: restaurant.id },
                                })
                            }
                        />
                    ))}
                </ScrollView>
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
    countLabel: {
        color: theme.colors.primary, fontWeight: 'bold', fontSize: 14,
        backgroundColor: 'rgba(244,155,51,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    emptyIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(244,155,51,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
    emptyTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    emptySubtitle: { color: theme.colors.textMuted, fontSize: 14, marginTop: 6, textAlign: 'center' },
    browseBtn: { marginTop: 24, backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    browseBtnText: { color: '#000', fontWeight: 'bold' },
    scrollContent: { padding: 16 },
});
