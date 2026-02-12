import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Button, Divider, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../src/redux/slices/orderSlice';
import { clearCart } from '../src/redux/slices/cartSlice';
import { useRouter } from 'expo-router';

export default function PlaceOrderScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector((state) => state.cart);
    const { order, success, error } = useSelector((state) => state.orders);

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 1000 ? 0 : 100); // Free shipping over 1000
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2))); // 15% Tax
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (success) {
            router.push(`/order/${order._id}`);
            dispatch(resetOrder());
            dispatch(clearCart());
        }
    }, [success, router, order, dispatch]);

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
            })
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.header}>Shipping</Text>
                <Text style={styles.text}>
                    {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                    {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </Text>
            </View>
            <Divider />

            <View style={styles.section}>
                <Text style={styles.header}>Payment Method</Text>
                <Text style={styles.text}>{cart.paymentMethod}</Text>
            </View>
            <Divider />

            <View style={styles.section}>
                <Text style={styles.header}>Order Items</Text>
                {cart.cartItems.length === 0 ? (
                    <Text>Your cart is empty</Text>
                ) : (
                    cart.cartItems.map((item, index) => (
                        <List.Item
                            key={index}
                            title={item.name}
                            description={`${item.qty} x ₱${item.price} = ₱${item.qty * item.price}`}
                            left={() => <Image source={{ uri: item.image }} style={styles.image} />}
                        />
                    ))
                )}
            </View>
            <Divider />

            <View style={styles.section}>
                <Text style={styles.header}>Order Summary</Text>
                <View style={styles.row}>
                    <Text>Items</Text>
                    <Text>₱{itemsPrice}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Shipping</Text>
                    <Text>₱{shippingPrice}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Tax</Text>
                    <Text>₱{taxPrice}</Text>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <View style={styles.row}>
                    <Text style={styles.bold}>Total</Text>
                    <Text style={styles.bold}>₱{totalPrice}</Text>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                <Button
                    mode="contained"
                    onPress={placeOrderHandler}
                    style={styles.button}
                    disabled={cart.cartItems === 0}
                >
                    Place Order
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#2E7D32',
    },
});
