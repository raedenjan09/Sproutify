import { View, Text, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function WishlistScreen() {
    return (
        <View style={styles.container}>
            <Ionicons name="heart-outline" size={80} color="#ccc" />
            <Title style={styles.title}>Your Wishlist is Empty</Title>
            <Text style={styles.subtitle}>Save items you want to buy later!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    title: {
        marginTop: 20,
        color: '#333',
    },
    subtitle: {
        color: '#666',
        marginTop: 10,
    },
});
