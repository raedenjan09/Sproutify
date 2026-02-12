import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, resetAuthSuccess } from '../../src/redux/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userInfo, loading, error, success } = useSelector((state) => state.auth);

    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [contactNumber, setContactNumber] = useState(userInfo?.contactNumber || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(userInfo?.profileImage || null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            router.replace('/login');
        } else {
            if (!name || name !== userInfo.name) setName(userInfo.name);
            if (!email || email !== userInfo.email) setEmail(userInfo.email);
            if (!contactNumber || contactNumber !== userInfo.contactNumber) setContactNumber(userInfo.contactNumber || '');
            if (!image || image !== userInfo.profileImage) setImage(userInfo.profileImage);
        }
    }, [userInfo, router]);

    useEffect(() => {
        if (success) {
            Alert.alert('Success', 'Profile Updated Successfully');
            dispatch(resetAuthSuccess());
            setPassword('');
            setConfirmPassword('');
        }
    }, [success, dispatch]);

    const handlePickImage = () => {
        Alert.alert(
            "Update Profile Photo",
            "Choose an option",
            [
                {
                    text: "Camera",
                    onPress: launchCamera,
                },
                {
                    text: "Gallery",
                    onPress: launchGallery,
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    const launchCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            handleImageUpload(result.assets[0].uri);
        }
    };

    const launchGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            handleImageUpload(result.assets[0].uri);
        }
    };

    const handleImageUpload = async (uri) => {
        setUploading(true);
        const data = new FormData();
        data.append('image', {
            uri,
            type: 'image/jpeg',
            name: 'profile_image.jpg',
        });

        try {
            const response = await fetch('http://192.168.1.13:5000/api/upload', { // Replace with your IP
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const text = await response.text();
            setImage(text);
            setUploading(false);
        } catch (error) {
            Alert.alert('Error', 'Image upload failed');
            setUploading(false);
        }
    };

    const submitHandler = () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        dispatch(updateUserProfile({ id: userInfo._id, name, email, contactNumber, password, profileImage: image }));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.avatar} />
                    ) : (
                        <Avatar.Text size={100} label={name ? name[0] : 'U'} style={styles.placeholderAvatar} />
                    )}
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <TextInput
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                    disabled // Email usually not editable for unique ID reasons
                />
                <TextInput
                    label="Contact Number"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                    keyboardType="phone-pad"
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                />
                <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    theme={{ colors: { primary: '#2E7D32' } }}
                />

                {error && <Text style={styles.error}>{error}</Text>}

                <Button
                    mode="contained"
                    onPress={submitHandler}
                    loading={loading || uploading}
                    disabled={loading || uploading}
                    style={styles.button}
                    buttonColor="#2E7D32"
                >
                    Update Profile
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholderAvatar: {
        backgroundColor: '#2E7D32',
    },
    changePhotoText: {
        marginTop: 10,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    form: {
        padding: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 10,
        padding: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});
