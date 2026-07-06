import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TripMatchingScreen } from './src/screens/TripMatchingScreen';
import { TrackingScreen } from './src/screens/TrackingScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerShown: true,
            headerTitle: 'Velo',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="TripMatching" component={TripMatchingScreen} options={{ headerShown: true, headerTitle: 'Solicitar Corrida', headerShadowVisible: false }} />
        <Stack.Screen name="Tracking" component={TrackingScreen} options={{ headerShown: true, headerTitle: 'Acompanhamento', headerShadowVisible: false }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: true, headerTitle: 'Pagamento', headerShadowVisible: false }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ headerShown: true, headerTitle: 'Avaliação', headerShadowVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
