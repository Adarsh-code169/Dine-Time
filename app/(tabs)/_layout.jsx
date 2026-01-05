import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../assets/images/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import useCartStore from '../store/cartStore';

const TabLayout = () => {
    const { getCartCount } = useCartStore();
    const cartCount = getCartCount();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.PRIMARY,
                tabBarInactiveTintColor: Colors.dark.text,
                tabBarStyle: {
                    backgroundColor: Colors.SECONDARY,
                    paddingBottom: 14,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color }) => (
                        <View style={{ position: 'relative' }}>
                            <Ionicons name="cart" size={24} color={color} />
                            {cartCount > 0 && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -8,
                                        backgroundColor: '#ef4444',
                                        borderRadius: 10,
                                        minWidth: 18,
                                        height: 18,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                        }}
                                    >
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
                    tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name="person-sharp" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
};

export default TabLayout;