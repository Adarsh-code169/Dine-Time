import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useFavoritesStore from '../store/favoritesStore';
import { theme } from '../constants/theme';

export default function RestaurantCard({ restaurant, imageSource, onPress }) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const isFav = isFavorite(restaurant.id);

    const handleFavoritePress = (e) => {
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.restaurantCard} activeOpacity={0.9}>
            <View style={styles.restaurantImageContainer}>
                <Image source={imageSource} style={styles.restaurantImage} resizeMode="cover" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.65)']}
                    style={styles.imageOverlay}
                />

                <View style={styles.timeBadge}>
                    <FontAwesome name="clock-o" size={11} color="#000" />
                    <Text style={styles.timeBadgeText}>{restaurant.time}</Text>
                </View>

                <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton} activeOpacity={0.7}>
                    <FontAwesome
                        name={isFav ? 'heart' : 'heart-o'}
                        size={18}
                        color={isFav ? theme.colors.danger : '#fff'}
                    />
                </TouchableOpacity>

                <View style={styles.bottomChips}>
                    <View style={styles.ratingBadge}>
                        <FontAwesome name="star" size={10} color="#000" />
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                    <View style={styles.deliveryChip}>
                        <FontAwesome name="bicycle" size={11} color={theme.colors.primary} />
                        <Text style={styles.deliveryChipText}>{restaurant.deliveryFee}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
                <Text style={styles.restaurantItems} numberOfLines={1}>
                    {restaurant.menuItems?.map((i) => i.name).join(' • ') || restaurant.category}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    restaurantCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.surfaceElevated,
        ...theme.shadows.card,
    },
    restaurantImageContainer: { height: 170, width: '100%', position: 'relative' },
    restaurantImage: { width: '100%', height: '100%' },
    imageOverlay: { ...StyleSheet.absoluteFillObject },
    timeBadge: {
        position: 'absolute', top: 12, right: 12,
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    },
    timeBadgeText: { fontWeight: 'bold', fontSize: 11, marginLeft: 4, color: '#000' },
    favoriteButton: {
        position: 'absolute', top: 12, left: 12,
        backgroundColor: 'rgba(0,0,0,0.45)',
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    bottomChips: { position: 'absolute', bottom: 12, left: 12, right: 12, flexDirection: 'row' },
    ratingBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: theme.colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    },
    ratingText: { color: '#000', fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
    deliveryChip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 999, marginLeft: 8,
    },
    deliveryChipText: { color: '#fff', fontSize: 11, fontWeight: '600', marginLeft: 6 },
    restaurantInfo: { padding: 14 },
    restaurantName: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
    restaurantItems: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4 },
});
