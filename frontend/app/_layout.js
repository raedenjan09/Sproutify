import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <PaperProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                        <Stack.Screen name="index" options={{ title: 'Home' }} />
                        <Stack.Screen name="cart" options={{ title: 'Shopping Cart', headerShown: true }} />
                        <Stack.Screen name="login" options={{ headerShown: false }} />
                        <Stack.Screen name="register" options={{ headerShown: false }} />
                    </Stack>
                </PaperProvider>
            </Provider>
        </GestureHandlerRootView>
    );
}
