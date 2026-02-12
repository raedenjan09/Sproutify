import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../src/redux/slices/authSlice';
import { Button, Text, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        router.replace('/login');
    };

    if (!userInfo) return <Text>Please login</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar.Text size={80} label={userInfo.name[0]} style={styles.avatar} />
                <Text variant="headlineMedium">{userInfo.name}</Text>
                <Text variant="bodyLarge">{userInfo.email}</Text>
                <Text variant="bodyMedium" style={styles.role}>Role: {userInfo.role}</Text>
            </View>

            <Button mode="contained" onPress={() => router.push('/orders')} style={styles.button} buttonColor="#2E7D32">
                My Orders
            </Button>
            {userInfo.role === 'admin' && (
                <Button mode="contained" onPress={() => router.push('/admin')} style={styles.button} buttonColor="#1976D2">
                    Admin Dashboard
                </Button>
            )}

            <Button mode="contained" onPress={handleLogout} style={styles.logoutBtn} buttonColor="#d32f2f">
                Logout
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 50,
    },
    avatar: {
        marginBottom: 10,
        backgroundColor: '#2E7D32',
    },
    role: {
        marginTop: 5,
        color: 'gray',
    },
    logoutBtn: {
        width: '100%',
        borderRadius: 5,
    },
});
