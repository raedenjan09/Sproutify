import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Button, Divider, List, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder, updateOrderToDelivered, cancelOrder, resetOrder } from '../../src/redux/slices/orderSlice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrderScreen() {
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const { order, loading, error, successPay, successDeliver } = useSelector((state) => state.orders);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!order || order._id !== id || successPay || successDeliver) {
            dispatch(resetOrder()); // Reset success flags if needed, or just fetch
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id, order, successPay, successDeliver]);

    const cancelHandler = () => {
        dispatch(cancelOrder(id));
    };

    if (loading) return <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />;
    if (error) return <Text style={styles.error}>{error}</Text>;
    if (!order) return <Text style={styles.error}>Order not found</Text>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.orderId}>Order {order._id}</Text>
                <Chip icon="information" style={styles.statusChip}>{order.status}</Chip>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shipping</Text>
                <Text style={styles.text}>Name: {order.user.name}</Text>
                <Text style={styles.text}>Email: {order.user.email}</Text>
                <Text style={styles.text}>
                    Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </Text>
                {order.isDelivered ? (
                    <View style={[styles.alert, styles.successAlert]}>
                        <Text style={styles.alertText}>Delivered on {order.deliveredAt.substring(0, 10)}</Text>
                    </View>
                ) : (
                    <View style={[styles.alert, styles.dangerAlert]}>
                        <Text style={styles.alertText}>Not Delivered</Text>
                    </View>
                )}
            </View>
            <Divider />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <Text style={styles.text}>Method: {order.paymentMethod}</Text>
                {order.isPaid ? (
                    <View style={[styles.alert, styles.successAlert]}>
                        <Text style={styles.alertText}>Paid on {order.paidAt.substring(0, 10)}</Text>
                    </View>
                ) : (
                    <View style={[styles.alert, styles.dangerAlert]}>
                        <Text style={styles.alertText}>Not Paid</Text>
                    </View>
                )}
            </View>
            <Divider />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                {order.orderItems.length === 0 ? (
                    <Text>Order is empty</Text>
                ) : (
                    order.orderItems.map((item, index) => (
                        <List.Item
                            key={index}
                            title={item.name}
                            description={`${item.qty} x ₱${item.price} = ₱${item.qty * item.price}`}
                            left={() => <Image source={{ uri: item.image }} style={styles.image} />}
                            onPress={() => router.push(`/product/${item.product}`)}
                        />
                    ))
                )}
            </View>
            <Divider />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.row}>
                    <Text>Items</Text>
                    <Text>₱{order.itemsPrice}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Shipping</Text>
                    <Text>₱{order.shippingPrice}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Tax</Text>
                    <Text>₱{order.taxPrice}</Text>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <View style={styles.row}>
                    <Text style={styles.bold}>Total</Text>
                    <Text style={styles.bold}>₱{order.totalPrice}</Text>
                </View>

                {order.status === 'Pending' && !order.isPaid && (
                    <Button
                        mode="contained"
                        onPress={() => dispatch(payOrder({ orderId: id, paymentResult: { id: 'mock_payment_id', status: 'completed', email_address: userInfo.email, update_time: Date.now() } }))}
                        style={styles.payButton}
                        icon="credit-card"
                    >
                        Pay Now (Mock)
                    </Button>
                )}

                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <Button
                        mode="contained"
                        onPress={() => dispatch(updateOrderToDelivered(id))}
                        style={styles.deliverButton}
                        icon="truck-delivery"
                    >
                        Mark As Delivered
                    </Button>
                )}

                {order.status === 'Pending' && !order.isPaid && (
                    <Button
                        mode="contained"
                        onPress={cancelHandler}
                        style={styles.cancelButton}
                        color="red"
                        icon="close-circle"
                    >
                        Cancel Order
                    </Button>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    statusChip: {
        backgroundColor: '#e0e0e0',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
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
    alert: {
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    successAlert: {
        backgroundColor: '#d4edda',
    },
    dangerAlert: {
        backgroundColor: '#f8d7da',
    },
    alertText: {
        color: '#155724', // Success text color (or #721c24 for danger)
        textAlign: 'center',
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
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: '#d32f2f',
    },
    payButton: {
        marginTop: 20,
        backgroundColor: '#1976D2',
    },
    deliverButton: {
        marginTop: 10,
        backgroundColor: '#F57C00',
    },
});
