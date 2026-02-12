import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function CustomHeader({ title, showCart = true }) {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{title}</Text>

            {showCart ? (
                <TouchableOpacity onPress={() => navigation.navigate('cart')}>
                    <Ionicons name="cart-outline" size={28} color="#fff" />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 28 }} /> // Placeholder for alignment
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15, // Increase vertical padding
        backgroundColor: '#2E7D32',
        paddingTop: 50, // Safe area padding
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
