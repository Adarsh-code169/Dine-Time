import { create } from 'zustand';

/**
 * Favorites Store using Zustand
 * Manages favorite restaurants
 */
const useFavoritesStore = create((set, get) => ({
    // Array of favorite restaurant IDs
    favorites: [],

    /**
     * Toggle favorite status of a restaurant
     * @param {number} restaurantId
     */
    toggleFavorite: (restaurantId) => {
        const { favorites } = get();
        if (favorites.includes(restaurantId)) {
            // Remove from favorites
            set({ favorites: favorites.filter((id) => id !== restaurantId) });
        } else {
            // Add to favorites
            set({ favorites: [...favorites, restaurantId] });
        }
    },

    /**
     * Check if a restaurant is favorited
     * @param {number} restaurantId
     * @returns {boolean}
     */
    isFavorite: (restaurantId) => {
        const { favorites } = get();
        return favorites.includes(restaurantId);
    },

    /**
     * Get all favorite restaurant IDs
     * @returns {Array<number>}
     */
    getFavorites: () => {
        return get().favorites;
    },
}));

export default useFavoritesStore;
