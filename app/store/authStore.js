import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as fbSignOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, DEMO_MODE } from '../config/firebase';

const DEMO_USER_KEY = '@dinetime/demo_user';

const mapError = (e) => {
    const code = e?.code || '';
    if (code.includes('invalid-credential') || code.includes('wrong-password'))
        return 'Invalid email or password.';
    if (code.includes('user-not-found')) return 'No account found with that email.';
    if (code.includes('email-already-in-use')) return 'An account with that email already exists.';
    if (code.includes('weak-password')) return 'Password should be at least 6 characters.';
    if (code.includes('invalid-email')) return 'Please enter a valid email address.';
    return e?.message || 'Something went wrong. Please try again.';
};

const useAuthStore = create((set, get) => ({
    user: null,
    profile: null,
    initializing: true,

    init: () => {
        if (DEMO_MODE) {
            AsyncStorage.getItem(DEMO_USER_KEY).then((raw) => {
                if (raw) {
                    const u = JSON.parse(raw);
                    set({ user: u, profile: u, initializing: false });
                } else {
                    set({ initializing: false });
                }
            });
            return () => {};
        }
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const snap = await getDoc(doc(db, 'users', fbUser.uid));
                set({
                    user: { uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName },
                    profile: snap.exists() ? snap.data() : null,
                    initializing: false,
                });
            } else {
                set({ user: null, profile: null, initializing: false });
            }
        });
        return unsub;
    },

    signUp: async ({ name, email, password }) => {
        if (DEMO_MODE) {
            const u = {
                uid: `demo-${Date.now()}`,
                email,
                displayName: name,
                addresses: [],
                createdAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(u));
            set({ user: u, profile: u });
            return u;
        }
        try {
            const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
            await updateProfile(cred.user, { displayName: name });
            const profile = {
                uid: cred.user.uid,
                email: cred.user.email,
                displayName: name,
                addresses: [],
                createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', cred.user.uid), profile);
            set({
                user: { uid: cred.user.uid, email: cred.user.email, displayName: name },
                profile,
            });
            return profile;
        } catch (e) {
            throw new Error(mapError(e));
        }
    },

    signIn: async ({ email, password }) => {
        if (DEMO_MODE) {
            const raw = await AsyncStorage.getItem(DEMO_USER_KEY);
            const stored = raw ? JSON.parse(raw) : null;
            const u = stored && stored.email === email.trim()
                ? stored
                : {
                    uid: `demo-${Date.now()}`,
                    email: email.trim(),
                    displayName: email.split('@')[0],
                    addresses: [],
                    createdAt: new Date().toISOString(),
                };
            await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(u));
            set({ user: u, profile: u });
            return u;
        }
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (e) {
            throw new Error(mapError(e));
        }
    },

    signOut: async () => {
        if (DEMO_MODE) {
            await AsyncStorage.removeItem(DEMO_USER_KEY);
            set({ user: null, profile: null });
            return;
        }
        await fbSignOut(auth);
        set({ user: null, profile: null });
    },

    resetPassword: async (email) => {
        if (DEMO_MODE) {
            return; // pretend success
        }
        try {
            await sendPasswordResetEmail(auth, email.trim());
        } catch (e) {
            throw new Error(mapError(e));
        }
    },

    updateProfileData: async (patch) => {
        const { user, profile } = get();
        if (!user) return;
        const next = { ...(profile || {}), ...patch };
        if (DEMO_MODE) {
            await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(next));
            set({ profile: next, user: { ...user, ...patch } });
            return;
        }
        await updateDoc(doc(db, 'users', user.uid), patch);
        set({ profile: next });
    },

    addAddress: async (address) => {
        const { profile, updateProfileData } = get();
        const addresses = [...(profile?.addresses || []), { id: Date.now().toString(), ...address }];
        await updateProfileData({ addresses });
    },

    removeAddress: async (id) => {
        const { profile, updateProfileData } = get();
        const addresses = (profile?.addresses || []).filter((a) => a.id !== id);
        await updateProfileData({ addresses });
    },

    continueAsGuest: () => {
        set({
            user: { uid: 'guest', email: null, displayName: 'Guest', isGuest: true },
            profile: { displayName: 'Guest', isGuest: true, addresses: [] },
        });
    },
}));

export default useAuthStore;
