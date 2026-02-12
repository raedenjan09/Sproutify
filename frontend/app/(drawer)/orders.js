import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { listMyOrders } from '../../src/redux/slices/orderSlice';
import { useRouter } from 'expo-router';

export default function OrderHistory() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(listMyOrders());
    }, [dispatch]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/order/${item._id}`)}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Title>Order {item._id.substring(0, 10)}...</Title>
                        <Chip textStyle={{ fontSize: 10, height: 16 }} style={{ height: 24 }}>{item.status}</Chip>
                    </View>
                    <Paragraph>Date: {item.createdAt.substring(0, 10)}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold' }}>Total: ₱{item.totalPrice}</Paragraph>
                    <View style={styles.row}>
                        <Text style={{ color: item.isPaid ? 'green' : 'red' }}>{item.isPaid ? 'Paid' : 'Not Paid'}</Text>
                        <Text> | </Text>
                        <Text style={{ color: item.isDelivered ? 'green' : 'red' }}>{item.isDelivered ? 'Delivered' : 'Not Delivered'}</Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />;
    if (error) return <Text style={styles.error}>{error === 'Network Request Failed' ? 'Please check your connection' : error}</Text>;

    return (
        <View style={styles.container}>
            {orders.length === 0 ? (
                <Text style={styles.empty}>No orders found</Text>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 10,
    },
    card: {
        marginBottom: 10,
        backgroundColor: 'white',
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginTop: 5,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    error: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: '#888',
    },
});
