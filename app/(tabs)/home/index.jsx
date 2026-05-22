import { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    FlatList,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { categories, restaurants } from '../../data/dummyData';
import RestaurantCard from '../../components/RestaurantCard';
import useAuthStore from '../../store/authStore';
import { theme } from '../../constants/theme';

import burgerImg from '../../../assets/images/food_burger.png';
import pastaImg from '../../../assets/images/food_pasta.png';
import pizzaImg from '../../../assets/images/food_pizza.png';

const imageMap = { food_burger: burgerImg, food_pasta: pastaImg, food_pizza: pizzaImg };

const PROMO = {
    title: 'Free delivery on your first order',
    subtitle: 'Use code FIRST10 at checkout',
};

export default function Home() {
    const router = useRouter();
    const { user, profile } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const displayName = (profile?.displayName || user?.displayName || 'there').split(' ')[0];

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return restaurants.filter((r) => {
            const matchesSearch =
                !q ||
                r.name.toLowerCase().includes(q) ||
                r.category.toLowerCase().includes(q) ||
                r.menuItems.some((i) => i.name.toLowerCase().includes(q));
            const matchesCategory = !selectedCategory || r.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    // Pick top 3 by rating as "trending"
    const trending = useMemo(
        () => [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4),
        []
    );

    const onRefresh = async () => {
        setRefreshing(true);
        // Real version would refetch from Firestore. We just simulate.
        await new Promise((r) => setTimeout(r, 700));
        setRefreshing(false);
    };

    const handleRestaurantPress = (restaurant) => {
        router.push({
            pathname: '/(tabs)/home/restaurant-details',
            params: { restaurantId: restaurant.id },
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
            >
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greeting}>Hello, {displayName} 👋</Text>
                        <Text style={styles.headerTitle}>What are you craving today?</Text>
                    </View>
                    <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
                        <Text style={styles.avatarBtnText}>{(displayName[0] || 'U').toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <FontAwesome name="search" size={18} color={theme.colors.textMuted} />
                        <TextInput
                            placeholder="Find your craving..."
                            placeholderTextColor={theme.colors.textDim}
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            returnKeyType="search"
                        />
                        {!!searchQuery && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <FontAwesome name="times-circle" size={18} color={theme.colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Promo banner */}
                <LinearGradient
                    colors={['#f49b33', '#ff7e3d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.promo}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.promoTitle}>{PROMO.title}</Text>
                        <Text style={styles.promoSubtitle}>{PROMO.subtitle}</Text>
                    </View>
                    <View style={styles.promoIcon}>
                        <FontAwesome name="bicycle" size={36} color="#fff" />
                    </View>
                </LinearGradient>

                {/* Categories */}
                <Text style={styles.sectionLabel}>Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.name;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                                onPress={() => setSelectedCategory(isSelected ? null : cat.name)}
                                activeOpacity={0.85}
                            >
                                <FontAwesome name={cat.icon} size={22} color={isSelected ? '#000' : theme.colors.primary} />
                                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{cat.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Trending strip */}
                {!searchQuery && !selectedCategory && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>🔥 Trending Now</Text>
                        </View>
                        <FlatList
                            horizontal
                            data={trending}
                            keyExtractor={(item) => `trend-${item.id}`}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.trendCard}
                                    onPress={() => handleRestaurantPress(item)}
                                    activeOpacity={0.85}
                                >
                                    <Image source={imageMap[item.image]} style={styles.trendImg} />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.85)']}
                                        style={styles.trendOverlay}
                                    />
                                    <View style={styles.trendBadge}>
                                        <FontAwesome name="star" size={10} color="#000" />
                                        <Text style={styles.trendBadgeText}>{item.rating}</Text>
                                    </View>
                                    <View style={styles.trendBody}>
                                        <Text style={styles.trendName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.trendCategory}>{item.category} · {item.time}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}

                {/* Restaurants list */}
                <View style={styles.restaurantsContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>
                            {selectedCategory ? `${selectedCategory} Restaurants` : 'All Restaurants'}
                        </Text>
                        <Text style={styles.countLabel}>{filtered.length} found</Text>
                    </View>

                    {filtered.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome name="search" size={48} color={theme.colors.surfaceHigh} />
                            <Text style={styles.emptyStateText}>No restaurants found</Text>
                            <Text style={styles.emptyStateSubtext}>Try a different search or category</Text>
                        </View>
                    ) : (
                        filtered.map((rest) => (
                            <RestaurantCard
                                key={rest.id}
                                restaurant={rest}
                                imageSource={imageMap[rest.image]}
                                onPress={() => handleRestaurantPress(rest)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 30 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
    greeting: { color: theme.colors.textMuted, fontSize: 13 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 2 },
    avatarBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center',
        ...theme.shadows.glow,
    },
    avatarBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    searchContainer: { paddingHorizontal: 16, marginTop: 16 },
    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: theme.colors.surface, borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 12,
        borderWidth: 1, borderColor: theme.colors.surfaceElevated,
    },
    searchInput: { flex: 1, marginLeft: 10, marginRight: 8, color: '#fff', fontSize: 15 },
    promo: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, padding: 18, borderRadius: 16, alignItems: 'center', ...theme.shadows.card },
    promoTitle: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    promoSubtitle: { color: 'rgba(0,0,0,0.7)', fontSize: 12, marginTop: 4 },
    promoIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12, paddingHorizontal: 16 },
    sectionLabel: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 12, marginHorizontal: 16 },
    countLabel: { color: theme.colors.textMuted, fontSize: 12 },
    categoriesScroll: { paddingHorizontal: 16, paddingBottom: 4 },
    categoryBtn: {
        alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14,
        borderRadius: 14, marginRight: 10, minWidth: 84,
        backgroundColor: theme.colors.surface,
        borderWidth: 1, borderColor: theme.colors.surfaceElevated,
    },
    categoryBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, ...theme.shadows.glow },
    categoryText: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#fff' },
    categoryTextActive: { color: '#000' },
    trendCard: {
        width: 200, height: 140, borderRadius: 14, overflow: 'hidden', marginRight: 12,
        backgroundColor: theme.colors.surface,
    },
    trendImg: { width: '100%', height: '100%', position: 'absolute' },
    trendOverlay: { ...StyleSheet.absoluteFillObject },
    trendBadge: {
        position: 'absolute', top: 10, right: 10, flexDirection: 'row',
        alignItems: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
    },
    trendBadgeText: { color: '#000', fontWeight: 'bold', fontSize: 11, marginLeft: 4 },
    trendBody: { position: 'absolute', bottom: 10, left: 12, right: 12 },
    trendName: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    trendCategory: { color: theme.colors.textMuted, fontSize: 11, marginTop: 2 },
    restaurantsContainer: { paddingHorizontal: 16, marginTop: 8 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyStateText: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginTop: 14 },
    emptyStateSubtext: { color: theme.colors.textMuted, fontSize: 13, marginTop: 6 },
});
