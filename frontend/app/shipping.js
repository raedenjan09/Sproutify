import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../src/redux/slices/cartSlice';
import { useRouter } from 'expo-router';

export default function ShippingScreen() {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const router = useRouter();

    const submitHandler = () => {
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        router.push('/placeorder');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Shipping Address</Text>

                <TextInput
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                />

                <TextInput
                    label="City"
                    value={city}
                    onChangeText={setCity}
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                />

                <TextInput
                    label="Postal Code"
                    value={postalCode}
                    onChangeText={setPostalCode}
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                    keyboardType="numeric"
                />

                <TextInput
                    label="Country"
                    value={country}
                    onChangeText={setCountry}
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                />

                <Button
                    mode="contained"
                    onPress={submitHandler}
                    style={styles.button}
                    contentStyle={{ height: 50 }}
                >
                    Continue to Checkout
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#2E7D32',
    },
});
