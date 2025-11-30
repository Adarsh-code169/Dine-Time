import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Reusable Menu Item Component
 * Displays menu item with add to cart functionality
 */
export default function MenuItem({ item, imageSource, onAddToCart }) {
    return (
        <View style={styles.menuItem}>
            <Image source={imageSource} style={styles.menuImage} resizeMode="cover" />
            <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.menuFooter}>
                    <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity onPress={onAddToCart} style={styles.addButton}>
                        <FontAwesome name="plus" size={14} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        backgroundColor: '#3b3b3b',
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    menuImage: {
        width: 100,
        height: 100,
        backgroundColor: '#4b5563',
    },
    menuInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    menuName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    menuDescription: {
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 4,
    },
    menuFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    menuPrice: {
        color: '#f49b33',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#f49b33',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
