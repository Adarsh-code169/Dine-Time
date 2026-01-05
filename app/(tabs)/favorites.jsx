import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { restaurants } from '../data/dummyData';
import RestaurantCard from '../components/RestaurantCard';
import useFavoritesStore from '../store/favoritesStore';

// Import images
import burgerImg from '../../assets/images/food_burger.png';
import pastaImg from '../../assets/images/food_pasta.png';
import pizzaImg from '../../assets/images/food_pizza.png';

const imageMap = {
    food_burger: burgerImg,
    food_pasta: pastaImg,
    food_pizza: pizzaImg,
};

export default function Favorites() {
    const router = useRouter();
    const { favorites } = useFavoritesStore();

    // Filter restaurants to show only favorites
    const favoriteRestaurants = restaurants.filter((restaurant) =>
        favorites.includes(restaurant.id)
    );

    const handleRestaurantPress = (restaurant) => {
        router.push({
            pathname: '/(tabs)/home/restaurant-details',
            params: { restaurantId: restaurant.id }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Favorites</Text>
            </View>

            {favoriteRestaurants.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="heart-o" size={80} color="#666" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>
                        Tap the heart icon on restaurants to save them here
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {favoriteRestaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            imageSource={imageMap[restaurant.image]}
                            onPress={() => handleRestaurantPress(restaurant)}
                        />
                    ))}
                </ScrollView>
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
});
