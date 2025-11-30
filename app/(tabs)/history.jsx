import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { restaurants } from '../data/dummyData';

// Import images
import burgerImg from '../../assets/images/food_burger.png';
import pastaImg from '../../assets/images/food_pasta.png';
import pizzaImg from '../../assets/images/food_pizza.png';

const imageMap = {
  food_burger: burgerImg,
  food_pasta: pastaImg,
  food_pizza: pizzaImg,
};

export default function History() {
  // Mock history data based on restaurants
  const historyData = [
    { id: '1', restaurantId: 1, date: 'Yesterday', price: '$24.50', items: '2x Classic Cheeseburger' },
    { id: '2', restaurantId: 3, date: '25 Nov', price: '$18.90', items: '1x Pepperoni Feast' },
    { id: '3', restaurantId: 2, date: '20 Nov', price: '$32.00', items: '2x Carbonara' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const restaurant = restaurants.find(r => r.id === item.restaurantId);
          return (
            <View style={styles.orderCard}>
              <Image
                source={imageMap[restaurant.image]}
                style={styles.orderImage}
              />
              <View style={styles.orderInfo}>
                <View style={styles.orderHeader}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <Text style={styles.orderItems}>{item.items}</Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderPrice}>{item.price}</Text>
                  <View style={styles.reorderButton}>
                    <FontAwesome name="refresh" size={12} color="#f49b33" />
                    <Text style={styles.reorderText}>Reorder</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
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
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#3b3b3b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#4b5563',
  },
  orderInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurantName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  orderDate: {
    color: '#9ca3af',
    fontSize: 12,
  },
  orderItems: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orderPrice: {
    color: '#f49b33',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 155, 51, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reorderText: {
    color: '#f49b33',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
});