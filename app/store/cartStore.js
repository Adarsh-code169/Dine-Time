import { create } from 'zustand';

/**
 * Cart Store using Zustand
 * Manages shopping cart state and operations
 */
const useCartStore = create((set, get) => ({
    // Cart items array - each item has: { restaurantId, restaurantName, menuItem, quantity, price }
    cartItems: [],

    /**
     * Add item to cart or increase quantity if already exists
     * @param {Object} item - { restaurantId, restaurantName, menuItem: { id, name, price, image } }
     */
    addToCart: (item) => {
        const { cartItems } = get();
        const existingItemIndex = cartItems.findIndex(
            (cartItem) =>
                cartItem.restaurantId === item.restaurantId &&
                cartItem.menuItem.id === item.menuItem.id
        );

        if (existingItemIndex > -1) {
            // Item already exists, increase quantity
            const updatedCart = [...cartItems];
            updatedCart[existingItemIndex].quantity += 1;
            set({ cartItems: updatedCart });
        } else {
            // New item, add to cart with quantity 1
            set({
                cartItems: [
                    ...cartItems,
                    {
                        ...item,
                        quantity: 1,
                    },
                ],
            });
        }
    },

    /**
     * Update quantity of a cart item
     * @param {number} restaurantId
     * @param {number} menuItemId
     * @param {number} newQuantity
     */
    updateQuantity: (restaurantId, menuItemId, newQuantity) => {
        const { cartItems } = get();
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            set({
                cartItems: cartItems.filter(
                    (item) =>
                        !(item.restaurantId === restaurantId && item.menuItem.id === menuItemId)
                ),
            });
        } else {
            const updatedCart = cartItems.map((item) =>
                item.restaurantId === restaurantId && item.menuItem.id === menuItemId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            set({ cartItems: updatedCart });
        }
    },

    /**
     * Remove item from cart
     * @param {number} restaurantId
     * @param {number} menuItemId
     */
    removeFromCart: (restaurantId, menuItemId) => {
        const { cartItems } = get();
        set({
            cartItems: cartItems.filter(
                (item) =>
                    !(item.restaurantId === restaurantId && item.menuItem.id === menuItemId)
            ),
        });
    },

    /**
     * Clear all items from cart
     */
    clearCart: () => {
        set({ cartItems: [] });
    },

    /**
     * Get total number of items in cart
     */
    getCartCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    },

    /**
     * Get total price of all items in cart
     */
    getTotalPrice: () => {
        const { cartItems } = get();
        return cartItems.reduce(
            (total, item) => total + item.menuItem.price * item.quantity,
            0
        );
    },
}));

export default useCartStore;
