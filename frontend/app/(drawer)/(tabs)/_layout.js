import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../../components/CustomHeader';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                header: ({ options }) => <CustomHeader title={options.title} />,
                tabBarActiveTintColor: '#2E7D32',
                tabBarStyle: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: '#fff',
                    elevation: 10,
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="wishlist"
                options={{
                    title: 'Wishlist',
                    tabBarIcon: ({ color }) => <Ionicons name="heart-outline" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
