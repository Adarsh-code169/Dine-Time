import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { categories, restaurants } from '../../data/dummyData';
import RestaurantCard from '../../components/RestaurantCard';

// Import images
import burgerImg from '../../../assets/images/food_burger.png';
import pastaImg from '../../../assets/images/food_pasta.png';
import pizzaImg from '../../../assets/images/food_pizza.png';

const imageMap = {
  food_burger: burgerImg,
  food_pasta: pastaImg,
  food_pizza: pizzaImg,
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter restaurants based on search query and selected category
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      searchQuery === '' ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.menuItems.some(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory ||
      restaurant.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryPress = (categoryName) => {
    // Toggle category selection
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handleRestaurantPress = (restaurant) => {
    // Navigate to restaurant details screen
    router.push({
      pathname: '/(tabs)/home/restaurant-details',
      params: { restaurantId: restaurant.id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtext}>Deliver to</Text>
            <Text style={styles.headerTitle}>Home, Sweet Home ▾</Text>
          </View>
          <View style={styles.notificationButton}>
            <FontAwesome name="bell" size={20} color="white" />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={20} color="#888" />
            <TextInput
              placeholder="Find your craving..."
              placeholderTextColor="#888"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryButton, isSelected ? styles.categoryButtonActive : styles.categoryButtonInactive]}
                  onPress={() => handleCategoryPress(cat.name)}
                >
                  <FontAwesome name={cat.icon} size={24} color={isSelected ? 'black' : 'white'} />
                  <Text style={[styles.categoryText, isSelected ? styles.categoryTextActive : styles.categoryTextInactive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Restaurants */}
        <View style={styles.restaurantsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? `${selectedCategory} Restaurants` : 'Featured Restaurants'}
            </Text>
            <Text style={styles.seeAllText}>See All</Text>
          </View>

          {filteredRestaurants.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="search" size={48} color="#666" />
              <Text style={styles.emptyStateText}>No restaurants found</Text>
              <Text style={styles.emptyStateSubtext}>Try a different search or category</Text>
            </View>
          ) : (
            filteredRestaurants.map((rest) => (
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
  container: {
    flex: 1,
    backgroundColor: '#2b2b2b',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerSubtext: {
    color: '#9ca3af',
    fontSize: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationButton: {
    backgroundColor: '#3b3b3b',
    padding: 10,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b3b3b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    color: '#fff',
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 24,
  },
  categoriesScroll: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
  },
  categoryButtonActive: {
    backgroundColor: '#f49b33',
  },
  categoryButtonInactive: {
    backgroundColor: '#3b3b3b',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000',
  },
  categoryTextInactive: {
    color: '#fff',
  },
  restaurantsContainer: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#f49b33',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
  },
});