import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { restaurants } from '../../data/dummyData';
import MenuItem from '../../components/MenuItem';
import useCartStore from '../../store/cartStore';
import useFavoritesStore from '../../store/favoritesStore';

// Import images
import burgerImg from '../../../assets/images/food_burger.png';
import pastaImg from '../../../assets/images/food_pasta.png';
import pizzaImg from '../../../assets/images/food_pizza.png';

const imageMap = {
    food_burger: burgerImg,
    food_pasta: pastaImg,
    food_pizza: pizzaImg,
};

export default function RestaurantDetails() {
    const router = useRouter();
    const { restaurantId } = useLocalSearchParams();
    const { addToCart } = useCartStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();

    // Find the restaurant by ID
    const restaurant = restaurants.find((r) => r.id === parseInt(restaurantId));

    if (!restaurant) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Restaurant not found</Text>
            </SafeAreaView>
        );
    }

    const isFav = isFavorite(restaurant.id);

    const handleAddToCart = (menuItem) => {
        addToCart({
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            menuItem: menuItem,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image
                        source={imageMap[restaurant.image]}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <FontAwesome name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>
                    {/* Favorite Button */}
                    <TouchableOpacity
                        onPress={() => toggleFavorite(restaurant.id)}
                        style={styles.favoriteButton}
                    >
                        <FontAwesome
                            name={isFav ? 'heart' : 'heart-o'}
                            size={24}
                            color={isFav ? '#ef4444' : '#fff'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Restaurant Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.restaurantName}>{restaurant.name}</Text>
                            <Text style={styles.category}>{restaurant.category}</Text>
                        </View>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{restaurant.rating}</Text>
                            <FontAwesome name="star" size={12} color="black" style={{ marginLeft: 4 }} />
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <FontAwesome name="clock-o" size={16} color="#f49b33" />
                            <Text style={styles.metaText}>{restaurant.time}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <FontAwesome name="bicycle" size={16} color="#f49b33" />
                            <Text style={styles.metaText}>{restaurant.deliveryFee}</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>{restaurant.description}</Text>
                </View>

                {/* Menu Section */}
                <View style={styles.menuContainer}>
                    <Text style={styles.menuTitle}>Menu</Text>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2b2b2b',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heroContainer: {
        height: 250,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3b3b3b',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    restaurantName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    category: {
        color: '#f49b33',
        fontSize: 14,
        marginTop: 4,
    },
    ratingBadge: {
        backgroundColor: '#f49b33',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 14,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    metaText: {
        color: '#9ca3af',
        fontSize: 14,
        marginLeft: 8,
    },
    description: {
        color: '#d1d5db',
        fontSize: 14,
        lineHeight: 20,
    },
    menuContainer: {
        padding: 16,
    },
    menuTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});
