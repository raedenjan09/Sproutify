import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserInfo } from '../src/redux/slices/authSlice';
import { fetchCart } from '../src/redux/slices/cartSlice';

export default function AuthCheck() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            const storedUserInfo = await AsyncStorage.getItem('userInfo');
            if (storedUserInfo) {
                dispatch(setUserInfo(JSON.parse(storedUserInfo)));
                dispatch(fetchCart()); // Fetch user's cart
                router.replace('/(drawer)/(tabs)');
            } else {
                router.replace('/login');
            }
        };

        if (!userInfo) {
            checkAuth();
        } else {
            router.replace('/(drawer)/(tabs)');
        }
    }, [userInfo]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2E7D32" />
        </View>
    );
}
