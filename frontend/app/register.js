import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { register } from '../src/redux/slices/authSlice';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();
    const { userInfo, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            router.replace('/(drawer)/(tabs)');
        }
    }, [userInfo, router]);

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        dispatch(register({ name, email, password }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Sproutify</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <Input
                label="Name"
                value={name}
                onChangeText={setName}
            />
            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Button onPress={handleRegister} loading={loading}>
                Sign Up
            </Button>
            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 30,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    link: {
        marginTop: 15,
        color: '#2E7D32',
        textAlign: 'center',
    },
});
