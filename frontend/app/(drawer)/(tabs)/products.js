import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
    { id: '1', name: 'Indoor Plants', icon: 'leaf' },
    { id: '2', name: 'Outdoor Plants', icon: 'sunny' },
    { id: '3', name: 'Succulents', icon: 'water' },
    { id: '4', name: 'Tools', icon: 'construct' },
    { id: '5', name: 'Pots & Planters', icon: 'cube' },
];

export default function ProductsScreen() {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item}>
            <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={30} color="#2E7D32" />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Title style={styles.header}>Categories</Title>
            <FlatList
                data={CATEGORIES}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    header: {
        marginBottom: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
});
