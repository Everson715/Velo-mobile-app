import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TripMatchingScreen } from './src/screens/TripMatchingScreen';
import { TrackingScreen } from './src/screens/TrackingScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      id="RootStack"
      initialRouteName={user ? "Home" : "Login"}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' }
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
