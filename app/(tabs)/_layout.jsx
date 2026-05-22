import { View, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import useCartStore from '../store/cartStore';
import { theme } from '../constants/theme';

export default function TabLayout() {
    const cartCount = useCartStore((s) => s.getCartCount());

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.surfaceElevated,
                    borderTopWidth: 1,
                    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
                    paddingTop: 8,
                    height: Platform.OS === 'ios' ? 86 : 68,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Orders',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ position: 'relative' }}>
                            <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />
                            {cartCount > 0 && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: -5,
                                        right: -10,
                                        backgroundColor: theme.colors.danger,
                                        borderRadius: 10,
                                        minWidth: 18,
                                        height: 18,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: 4,
                                        borderWidth: 1.5,
                                        borderColor: theme.colors.surface,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
