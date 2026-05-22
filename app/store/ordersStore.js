import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db, DEMO_MODE } from '../config/firebase';
import { ORDER_STATUSES } from '../constants/theme';

const useOrdersStore = create(
    persist(
        (set, get) => ({
            orders: [],
            loading: false,
            unsubscribe: null,
            activeOrderId: null,

            placeOrder: async ({ user, items, address, paymentMethod, subtotal, deliveryFee, tax, total }) => {
                const orderPayload = {
                    userId: user?.uid || 'guest',
                    userName: user?.displayName || 'Guest',
                    items: items.map((i) => ({
                        restaurantId: i.restaurantId,
                        restaurantName: i.restaurantName,
                        menuItemId: i.menuItem.id,
                        name: i.menuItem.name,
                        price: i.menuItem.price,
                        image: i.menuItem.image,
                        quantity: i.quantity,
                    })),
                    restaurantName: items[0]?.restaurantName,
                    restaurantImage: items[0]?.menuItem?.image,
                    address,
                    paymentMethod,
                    subtotal,
                    deliveryFee,
                    tax,
                    total,
                    status: 'placed',
                    createdAt: new Date().toISOString(),
                };

                if (DEMO_MODE || !user || user.isGuest) {
                    const localId = `local-${Date.now()}`;
                    const order = { id: localId, ...orderPayload };
                    set({ orders: [order, ...get().orders], activeOrderId: localId });
                    // Simulate progression locally
                    scheduleDemoProgression(localId, set, get);
                    return order;
                }

                const ref = await addDoc(collection(db, 'orders'), {
                    ...orderPayload,
                    createdAt: serverTimestamp(),
                });
                // Simulate kitchen progression (in real app this would be backend-driven)
                scheduleDemoProgression(ref.id, set, get, true);
                set({ activeOrderId: ref.id });
                return { id: ref.id, ...orderPayload };
            },

            subscribeToUserOrders: (userId) => {
                const prev = get().unsubscribe;
                if (prev) prev();
                if (DEMO_MODE || !userId || userId === 'guest') {
                    return;
                }
                set({ loading: true });
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc')
                );
                const unsub = onSnapshot(q, (snap) => {
                    const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                    // Merge with local (demo) orders that weren't synced
                    const local = get().orders.filter((o) => o.id.startsWith('local-'));
                    set({ orders: [...remote, ...local], loading: false });
                });
                set({ unsubscribe: unsub });
            },

            unsubscribeOrders: () => {
                const u = get().unsubscribe;
                if (u) u();
                set({ unsubscribe: null });
            },

            getOrderById: (id) => get().orders.find((o) => o.id === id),

            advanceLocalOrder: (id) => {
                const orders = get().orders.map((o) => {
                    if (o.id !== id) return o;
                    const idx = ORDER_STATUSES.indexOf(o.status);
                    const next = ORDER_STATUSES[Math.min(idx + 1, ORDER_STATUSES.length - 1)];
                    return { ...o, status: next };
                });
                set({ orders });
            },
        }),
        {
            name: 'dinetime-orders',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ orders: state.orders }),
        }
    )
);

// Simulated progression: 30s → preparing, +60s → on_the_way, +60s → delivered
const scheduleDemoProgression = (orderId, set, get, syncToFirestore = false) => {
    const transitions = [
        { delay: 20000, status: 'preparing' },
        { delay: 60000, status: 'on_the_way' },
        { delay: 120000, status: 'delivered' },
    ];
    transitions.forEach(({ delay, status }) => {
        setTimeout(async () => {
            const orders = get().orders.map((o) =>
                o.id === orderId ? { ...o, status } : o
            );
            set({ orders });
            if (syncToFirestore && !DEMO_MODE) {
                try {
                    await updateDoc(doc(db, 'orders', orderId), { status });
                } catch {}
            }
        }, delay);
    });
};

export default useOrdersStore;
