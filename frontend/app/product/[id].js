import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, createProductReview, resetReview } from '../../src/redux/slices/productSlice';
import { addToCart } from '../../src/redux/slices/cartSlice';
import { Text, Button, Divider, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { product, loading, error, reviewSuccess, reviewError } = useSelector((state) => state.products);
    const { userInfo } = useSelector((state) => state.auth) || {};

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (reviewSuccess) {
            alert('Review Submitted Successfully!');
            setRating(5);
            setComment('');
            dispatch(resetReview());
        }
        if (reviewError) {
            alert(reviewError);
            dispatch(resetReview());
        }
        dispatch(fetchProductDetails(id));
    }, [dispatch, id, reviewSuccess, reviewError]);

    const submitHandler = () => {
        if (!userInfo) {
            alert('Please Login to write a review');
            router.push('/login');
            return;
        }
        dispatch(createProductReview({ productId: id, review: { rating, comment } }));
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, product: product._id, qty: 1 }));
        alert('Added to cart');
    };

    if (loading) return <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.image} />
                    <Ionicons
                        name="arrow-back-circle"
                        size={40}
                        color="rgba(0,0,0,0.5)"
                        style={styles.backButton}
                        onPress={() => router.back()}
                    />
                </View>

                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.name}>{product.name}</Text>
                        <Text style={styles.price}>₱{product.price}</Text>
                    </View>

                    <View style={styles.stockContainer}>
                        <Ionicons
                            name={product.countInStock > 0 ? "checkmark-circle" : "close-circle"}
                            size={20}
                            color={product.countInStock > 0 ? "#2E7D32" : "red"}
                        />
                        <Text style={[styles.stockText, { color: product.countInStock > 0 ? "#2E7D32" : "red" }]}>
                            {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 20 }} />

                    <Text style={styles.sectionTitle}>Reviews ({product.numReviews})</Text>
                    {product.reviews && product.reviews.length === 0 && <Text style={{ fontStyle: 'italic', color: '#888' }}>No reviews yet</Text>}
                    {product.reviews && product.reviews.map((review) => (
                        <View key={review._id} style={{ marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold' }}>{review.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Ionicons
                                            key={i}
                                            name={i < review.rating ? "star" : "star-outline"}
                                            size={16}
                                            color="#FFD700"
                                        />
                                    ))}
                                </View>
                            </View>
                            <Text style={{ fontSize: 12, color: '#888', marginBottom: 5 }}>{review.createdAt.substring(0, 10)}</Text>
                            <Text style={{ color: '#444' }}>{review.comment}</Text>
                        </View>
                    ))}

                    <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 20 }} />

                    <Text style={styles.sectionTitle}>
                        {product.reviews && product.reviews.some(r => r.user === userInfo?._id) ? "Edit Your Review" : "Write a Review"}
                    </Text>
                    {userInfo ? (
                        <View style={styles.form}>
                            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <Ionicons
                                        key={r}
                                        name={r <= rating ? "star" : "star-outline"}
                                        size={32}
                                        color="#FFD700"
                                        onPress={() => setRating(r)}
                                    />
                                ))}
                            </View>
                            <TextInput
                                mode="outlined"
                                label="Comment"
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                numberOfLines={3}
                                style={{ marginBottom: 15, backgroundColor: 'white' }}
                                theme={{ colors: { primary: '#2E7D32' } }}
                            />
                            <Button mode="contained" onPress={submitHandler} style={{ backgroundColor: '#2E7D32' }}>
                                {product.reviews && product.reviews.some(r => r.user === userInfo?._id) ? "Update Review" : "Submit Review"}
                            </Button>
                        </View>
                    ) : (
                        <Button mode="outlined" onPress={() => router.push('/login')} style={{ borderColor: '#2E7D32', marginTop: 10 }}>
                            Login to Write a Review
                        </Button>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleAddToCart}
                    style={styles.addButton}
                    contentStyle={{ height: 50 }}
                    labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                    disabled={product.countInStock === 0}
                    icon="cart"
                >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 100, // Space for footer
    },
    imageContainer: {
        width: width,
        height: width, // Square image
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#fff',
        marginTop: -30, // Overlap image slightly
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
        color: '#333',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stockText: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#444',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
    },
    addButton: {
        backgroundColor: '#2E7D32',
        borderRadius: 30,
    },
    error: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
});
