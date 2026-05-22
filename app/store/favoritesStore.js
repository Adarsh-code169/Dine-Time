import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFavoritesStore = create(
    persist(
        (set, get) => ({
            favorites: [],

            toggleFavorite: (restaurantId) => {
                const { favorites } = get();
                if (favorites.includes(restaurantId)) {
                    set({ favorites: favorites.filter((id) => id !== restaurantId) });
                } else {
                    set({ favorites: [...favorites, restaurantId] });
                }
            },

            isFavorite: (restaurantId) => get().favorites.includes(restaurantId),

            getFavorites: () => get().favorites,

            clearFavorites: () => set({ favorites: [] }),
        }),
        {
            name: 'dinetime-favorites',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useFavoritesStore;
