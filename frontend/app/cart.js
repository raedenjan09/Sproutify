import React from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../src/redux/slices/cartSlice';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { cartItems } = useSelector((state) => state.cart);

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    const handleCheckout = () => {
        router.push('/shipping');
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.price}>₱{item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(item.product))} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={24} color="#d32f2f" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <Button mode="outlined" onPress={() => router.push('/(drawer)/(tabs)')} style={styles.shopBtn}>
                        Go Shopping
                    </Button>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.product}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalPrice}>₱{total}</Text>
                        </View>
                        <Button mode="contained" onPress={handleCheckout} style={styles.checkoutBtn} labelStyle={{ fontSize: 18 }}>
                            Checkout
                        </Button>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    list: {
        padding: 15,
        paddingBottom: 100,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        padding: 10,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    removeBtn: {
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 20,
        color: '#888',
        marginTop: 20,
        marginBottom: 20,
    },
    shopBtn: {
        borderColor: '#2E7D32',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 20,
        backgroundColor: 'white',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    checkoutBtn: {
        backgroundColor: '#2E7D32',
        borderRadius: 30,
        paddingVertical: 5,
    },
});
