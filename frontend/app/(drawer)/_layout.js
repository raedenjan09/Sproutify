import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../components/CustomDrawerContent';
import CustomHeader from '../../components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false, // We will use custom header inside screens or default if preferred
                drawerActiveTintColor: '#2E7D32',
                drawerInactiveTintColor: '#333',
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel: 'Home',
                    title: 'Sproutify',
                    drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="profile"
                options={{
                    drawerLabel: 'My Profile',
                    title: 'My Profile',
                    drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="orders"
                options={{
                    drawerLabel: 'Order History',
                    title: 'My Orders',
                    drawerIcon: ({ color }) => <Ionicons name="list-outline" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="edit-profile"
                options={{
                    drawerLabel: 'Edit Profile',
                    title: 'Edit Profile',
                    drawerIcon: ({ color }) => <Ionicons name="create-outline" size={22} color={color} />,
                }}
            />
        </Drawer>
    );
}
