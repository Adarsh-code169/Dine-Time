import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function MenuItem({ item, imageSource, onAddToCart }) {
    return (
        <View style={styles.menuItem}>
            <Image source={imageSource} style={styles.menuImage} resizeMode="cover" />
            <View style={styles.menuInfo}>
                <Text style={styles.menuName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.menuDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.menuFooter}>
                    <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity onPress={onAddToCart} style={styles.addButton} activeOpacity={0.8}>
                        <FontAwesome name="plus" size={14} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        marginBottom: 14,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.surfaceElevated,
    },
    menuImage: { width: 110, height: 110, backgroundColor: theme.colors.surfaceHigh },
    menuInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
    menuName: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    menuDescription: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 16 },
    menuFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    menuPrice: { color: theme.colors.primary, fontSize: 16, fontWeight: 'bold' },
    addButton: {
        backgroundColor: theme.colors.primary,
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        ...theme.shadows.glow,
    },
});
