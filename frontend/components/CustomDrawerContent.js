import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { logout } from '../src/redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await dispatch(logout());
        router.replace('/login');
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#2E7D32' }}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} // Placeholder user icon
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{userInfo?.name || 'User'}</Text>
                    <Text style={styles.email}>{userInfo?.email || 'user@example.com'}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={handleLogout} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="log-out-outline" size={22} />
                    <Text style={{ fontSize: 15, marginLeft: 5 }}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        alignItems: 'center', // Center content horizontally
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
        backgroundColor: '#fff', // Add background for transparency based icons
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5, // Add spacing between name and email
    },
    email: {
        color: '#fff',
        fontSize: 14,
    },
});
