import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],

            addToCart: (item) => {
                const { cartItems } = get();
                const idx = cartItems.findIndex(
                    (c) =>
                        c.restaurantId === item.restaurantId &&
                        c.menuItem.id === item.menuItem.id
                );
                if (idx > -1) {
                    const updated = [...cartItems];
                    updated[idx].quantity += 1;
                    set({ cartItems: updated });
                } else {
                    set({ cartItems: [...cartItems, { ...item, quantity: 1 }] });
                }
            },

            updateQuantity: (restaurantId, menuItemId, newQuantity) => {
                const { cartItems } = get();
                if (newQuantity <= 0) {
                    set({
                        cartItems: cartItems.filter(
                            (i) => !(i.restaurantId === restaurantId && i.menuItem.id === menuItemId)
                        ),
                    });
                } else {
                    set({
                        cartItems: cartItems.map((i) =>
                            i.restaurantId === restaurantId && i.menuItem.id === menuItemId
                                ? { ...i, quantity: newQuantity }
                                : i
                        ),
                    });
                }
            },

            removeFromCart: (restaurantId, menuItemId) => {
                const { cartItems } = get();
                set({
                    cartItems: cartItems.filter(
                        (i) => !(i.restaurantId === restaurantId && i.menuItem.id === menuItemId)
                    ),
                });
            },

            clearCart: () => set({ cartItems: [] }),

            getCartCount: () =>
                get().cartItems.reduce((t, i) => t + i.quantity, 0),

            getTotalPrice: () =>
                get().cartItems.reduce((t, i) => t + i.menuItem.price * i.quantity, 0),
        }),
        {
            name: 'dinetime-cart',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useCartStore;
