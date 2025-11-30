import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useFavoritesStore from '../store/favoritesStore';

/**
 * Reusable Restaurant Card Component
 * Displays restaurant information with favorite toggle
 */
export default function RestaurantCard({ restaurant, imageSource, onPress }) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const isFav = isFavorite(restaurant.id);

    const handleFavoritePress = (e) => {
        e.stopPropagation(); // Prevent card click when toggling favorite
        toggleFavorite(restaurant.id);
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.restaurantCard}>
            <View style={styles.restaurantImageContainer}>
                <Image
                    source={imageSource}
                    style={styles.restaurantImage}
                    resizeMode="cover"
                />
                <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>{restaurant.time}</Text>
                </View>
                {/* Favorite Heart Icon */}
                <TouchableOpacity
                    onPress={handleFavoritePress}
                    style={styles.favoriteButton}
                >
                    <FontAwesome
                        name={isFav ? 'heart' : 'heart-o'}
                        size={20}
                        color={isFav ? '#ef4444' : '#fff'}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                    <View style={styles.restaurantDetails}>
                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                        <Text style={styles.restaurantItems} numberOfLines={1}>
                            {restaurant.menuItems?.map(item => item.name).join(' • ') || restaurant.category}
                        </Text>
                    </View>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        <FontAwesome name="star" size={10} color="black" style={{ marginLeft: 4 }} />
                    </View>
                </View>

                <View style={styles.deliveryInfo}>
                    <FontAwesome name="bicycle" size={14} color="#f49b33" />
                    <Text style={styles.deliveryText}>{restaurant.deliveryFee} Delivery</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    restaurantCard: {
        backgroundColor: '#3b3b3b',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    restaurantImageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
    },
    timeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    timeBadgeText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restaurantInfo: {
        padding: 16,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    restaurantDetails: {
        flex: 1,
    },
    restaurantName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    restaurantItems: {
        color: '#9ca3af',
        fontSize: 14,
        marginTop: 4,
    },
    ratingBadge: {
        backgroundColor: '#f49b33',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 12,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#4b5563',
    },
    deliveryText: {
        color: '#9ca3af',
        fontSize: 12,
        marginLeft: 8,
    },
});
