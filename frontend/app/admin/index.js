import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import api from '../../src/services/api';
import { Card, Title, Paragraph, Text, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await api.get('/api/admin/stats', config);
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.role === 'admin') {
            fetchStats();
        } else {
            router.replace('/(tabs)');
        }
    }, [userInfo]);

    if (loading) return <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.header}>Admin Dashboard</Title>
            <View style={styles.statsContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>{stats.usersCount}</Title>
                        <Paragraph>Users</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>{stats.productsCount}</Title>
                        <Paragraph>Products</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>{stats.ordersCount}</Title>
                        <Paragraph>Orders</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>{stats.totalSales} PHP</Title>
                        <Paragraph>Total Sales</Paragraph>
                    </Card.Content>
                </Card>
            </View>

            {/* Links to Management Screens could go here */}
            {/* <Button onPress={() => router.push('/admin/products')}>Manage Products</Button> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
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
});
