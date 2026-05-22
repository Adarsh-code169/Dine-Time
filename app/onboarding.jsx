import { useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import burger from '../assets/images/food_burger.png';
import pasta from '../assets/images/food_pasta.png';
import pizza from '../assets/images/food_pizza.png';
import { theme } from './constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        key: '1',
        image: burger,
        title: 'Discover local favorites',
        subtitle: 'Browse curated restaurants and dishes near you, ranked by what other diners love.',
    },
    {
        key: '2',
        image: pasta,
        title: 'Order in seconds',
        subtitle: 'Build your cart, save a payment method, and check out faster than your stomach rumbles.',
    },
    {
        key: '3',
        image: pizza,
        title: 'Track every bite',
        subtitle: 'Real-time updates from kitchen to doorstep — know exactly when your food is on the move.',
    },
];

export default function Onboarding() {
    const router = useRouter();
    const listRef = useRef(null);
    const [index, setIndex] = useState(0);

    const finish = async () => {
        await AsyncStorage.setItem('@dinetime/onboarded', '1');
        router.replace('/');
    };

    const next = () => {
        if (index < SLIDES.length - 1) {
            listRef.current?.scrollToIndex({ index: index + 1, animated: true });
        } else {
            finish();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topBar}>
                <Text style={styles.brand}>Dine-Time</Text>
                <TouchableOpacity onPress={finish}>
                    <Text style={styles.skip}>Skip</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={listRef}
                data={SLIDES}
                keyExtractor={(s) => s.key}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) =>
                    setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
                }
                renderItem={({ item }) => (
                    <View style={[styles.slide, { width }]}>
                        <View style={styles.imageWrap}>
                            <LinearGradient
                                colors={['rgba(244,155,51,0.15)', 'rgba(244,155,51,0)']}
                                style={styles.imageHalo}
                            />
                            <Image source={item.image} style={styles.image} resizeMode="cover" />
                        </View>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.subtitle}</Text>
                    </View>
                )}
            />

            <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                    <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
            </View>

            <TouchableOpacity onPress={next} activeOpacity={0.85} style={styles.nextWrap}>
                <LinearGradient
                    colors={theme.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.nextBtn}
                >
                    <Text style={styles.nextText}>
                        {index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    <FontAwesome name="arrow-right" size={16} color="#000" style={{ marginLeft: 10 }} />
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 8,
        alignItems: 'center',
    },
    brand: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
    skip: { color: theme.colors.textMuted, fontSize: 14 },
    slide: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 40 },
    imageWrap: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 36 },
    imageHalo: { position: 'absolute', width: 260, height: 260, borderRadius: 130 },
    image: { width: 240, height: 240, borderRadius: 120 },
    title: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
    subtitle: { color: theme.colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 12 },
    dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: 24 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceHigh, marginHorizontal: 4 },
    dotActive: { width: 24, backgroundColor: theme.colors.primary },
    nextWrap: { paddingHorizontal: 28, paddingBottom: 24 },
    nextBtn: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.glow,
    },
    nextText: { color: '#000', fontSize: 17, fontWeight: 'bold' },
});
