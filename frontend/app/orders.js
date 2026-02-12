import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import api from '../src/services/api';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await api.get('/api/orders/myorders', config);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchOrders();
        }
    }, [userInfo]);

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>Order ID: {item._id}</Title>
                <Paragraph>Date: {item.createdAt.substring(0, 10)}</Paragraph>
                <Paragraph>Total: {item.totalPrice} PHP</Paragraph>
                <Paragraph>Status: {item.isPaid ? 'Paid' : 'Not Paid'} | {item.isDelivered ? 'Delivered' : 'Not Delivered'}</Paragraph>
            </Card.Content>
        </Card>
    );

    if (loading) return <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />;
    if (error) return <Text style={styles.error}>{error}</Text>;

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
    },
});
