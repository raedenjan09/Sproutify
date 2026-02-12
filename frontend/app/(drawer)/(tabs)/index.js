import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TextInput, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchTopProducts } from '../../../src/redux/slices/productSlice';
import { useRouter } from 'expo-router';
import { addToCart } from '../../../src/redux/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { Chip } from 'react-native-paper';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 15;

const CATEGORIES = ['All', 'Indoor', 'Outdoor', 'Tools', 'Seeds', 'Pots'];

export default function HomeScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { products, topProducts, loading, error } = useSelector((state) => state.products);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    // Using debounce or direct fetch on submit/change logic can be refined

    // Fetch Top Products once
    useEffect(() => {
        dispatch(fetchTopProducts());
    }, [dispatch]);

    const loadProducts = useCallback(() => {
        dispatch(fetchProducts({
            keyword: searchQuery,
            category: selectedCategory === 'All' ? '' : selectedCategory,
            minPrice,
            maxPrice
        }));
    }, [dispatch, searchQuery, selectedCategory, minPrice, maxPrice]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [loadProducts]);

    const handlePriceChange = (type, value) => {
        if (type === 'min') setMinPrice(value);
        if (type === 'max') setMaxPrice(value);
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart({ ...item, product: item._id }));
        alert(`${item.name} added to cart!`);
    };

    const renderFeaturedItem = ({ item }) => (
        <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => router.push(`/product/${item._id}`)}
            activeOpacity={0.95}
        >
            <Image source={{ uri: item.image }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{item.name}</Text>
                <Text style={styles.featuredPrice}>₱{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item._id}`)}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                    }}
                >
                    <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>₱{item.price}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search seeds, tools..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
                    {CATEGORIES.map((cat) => (
                        <Chip
                            key={cat}
                            selected={selectedCategory === cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
                            textStyle={{ color: selectedCategory === cat ? 'white' : '#333' }}
                        >
                            {cat}
                        </Chip>
                    ))}
                </ScrollView>

                <View style={styles.priceFilter}>
                    <TextInput
                        placeholder="Min ₱"
                        style={styles.priceInput}
                        keyboardType="numeric"
                        onChangeText={(text) => handlePriceChange('min', text)}
                    />
                    <Text>-</Text>
                    <TextInput
                        placeholder="Max ₱"
                        style={styles.priceInput}
                        keyboardType="numeric"
                        onChangeText={(text) => handlePriceChange('max', text)}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    ListHeaderComponent={
                        <>
                            {topProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
                                <View style={styles.featuredSection}>
                                    <Text style={styles.sectionHeader}>Featured</Text>
                                    <FlatList
                                        data={topProducts}
                                        renderItem={renderFeaturedItem}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={item => item._id}
                                        contentContainerStyle={{ paddingHorizontal: 10 }}
                                    />
                                </View>
                            )}
                            <Text style={styles.sectionHeader}>All Products</Text>
                        </>
                    }
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        elevation: 2,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    filterContainer: {
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    priceFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    priceInput: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
        width: 80,
        marginHorizontal: 5,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    chip: {
        marginHorizontal: 5,
        backgroundColor: '#e0e0e0',
    },
    chipSelected: {
        backgroundColor: '#2E7D32',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
        color: '#333',
    },
    featuredSection: {
        marginBottom: 20,
    },
    featuredCard: {
        width: 280,
        height: 150,
        marginRight: 15,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
    },
    featuredTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    featuredPrice: {
        color: '#4CAF50',
        fontWeight: 'bold',
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
    list: {
        padding: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3,
    },
    imageContainer: {
        position: 'relative',
        height: COLUMN_WIDTH,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    addBtn: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#2E7D32',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    details: {
        padding: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        height: 40,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 2,
    },
});
