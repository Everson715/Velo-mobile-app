    import React from 'react';                                                                                                                 
    import { NavigationContainer } from '@react-navigation/native';                                                                            
    import { createNativeStackNavigator } from '@react-navigation/native-stack';                                                               
    import { ActivityIndicator, View, StatusBar } from 'react-native';                                                                         
                                                                                                                                               
    import { LoginScreen } from '../screens/LoginScreen';                                                                                      
    import { RegisterScreen } from '../screens/RegisterScreen';                                                                                
    import { HomeScreen } from '../screens/HomeScreen';                                                                                        
    import { TripMatchingScreen } from '../screens/TripMatchingScreen';                                                                        
    import { DriverRoutesScreen } from '../screens/DriverRoutesScreen';                                                                        
    import { TrackingScreen } from '../screens/TrackingScreen';                                                                                
    import { PaymentScreen } from '../screens/PaymentScreen';                                                                                  
    import { ReviewScreen } from '../screens/ReviewScreen';                                                                                    
                                                                                                                                               
    import { useAuth } from '../contexts/AuthContext';                                                                                         
    import { colors } from '../theme';                                                                                                         
                                                                                                                                               
    const Stack = createNativeStackNavigator();                                                                                                
                                                                                                                                               
    export const AppNavigator = () => {                                                                                                        
      const { user, loading } = useAuth();                                                                                                     
                                                                                                                                               
      if (loading) {                                                                                                                           
        return (                                                                                                                               
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>                       
            <ActivityIndicator size="large" color={colors.primary} />                                                                          
          </View>                                                                                                                              
        );                                                                                                                                     
      }                                                                                                                                        
                                                                                                                                               
      return (                                                                                                                                 
        <>                                                                                                                                     
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />                                                           
          <NavigationContainer theme={{                                                                                                        
            dark: true,                                                                                                                        
            colors: {                                                                                                                          
              primary: colors.primary,                                                                                                         
              background: colors.background,                                                                                                   
              card: colors.card,                                                                                                               
              text: colors.text,                                                                                                               
              border: colors.border,                                                                                                           
              notification: colors.primary,                                                                                                    
            },                                                                                                                                 
          }}>                                                                                                                                  
            <Stack.Navigator                                                                                                                   
              screenOptions={{                                                                                                                 
                headerShown: false,                                                                                                            
                contentStyle: { backgroundColor: colors.background },                                                                          
                headerStyle: { backgroundColor: colors.background },                                                                           
                headerTintColor: colors.text,                                                                                                  
                headerTitleStyle: { fontWeight: '700' },                                                                                       
                headerShadowVisible: false,                                                                                                    
              }}                                                                                                                               
            >                                                                                                                                  
              {!user ? (                                                                                                                       
                // Auth Flow - Somente exibido se não houver 'user'                                                                            
                <Stack.Group>                                                                                                                  
                  <Stack.Screen name="Login" component={LoginScreen} />                                                                        
                  <Stack.Screen name="Register" component={RegisterScreen} />                                                                  
                </Stack.Group>                                                                                                                 
              ) : user.role === 'passenger' ? (                                                                                                
                // Passenger Flow - Injetado no milissegundo que 'user.role' = passenger                                                       
                <Stack.Group>                                                                                                                  
                  <Stack.Screen name="PassengerHome" component={TripMatchingScreen} />                                                         
                  <Stack.Screen name="Tracking" component={TrackingScreen} options={{ headerShown: true, headerTitle: 'Live Tracking' }} />    
                  <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: true, headerTitle: 'Payment' }} />            
                  <Stack.Screen name="Review" component={ReviewScreen} options={{ headerShown: true, headerTitle: 'Rate Ride' }} />            
                </Stack.Group>                                                                                                                 
              ) : (                                                                                                                            
                // Driver Flow - Injetado caso 'user' exista, mas não seja passenger                                                           
                <Stack.Group>                                                                                                                  
                  <Stack.Screen name="DriverHome" component={DriverRoutesScreen} />                                                            
                  <Stack.Screen name="Tracking" component={TrackingScreen} options={{ headerShown: true, headerTitle: 'Live Tracking' }} />    
                  <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: true, headerTitle: 'Earnings & Payouts' }} /> 
                  <Stack.Screen name="Review" component={ReviewScreen} options={{ headerShown: true, headerTitle: 'Passenger Reviews' }} />    
                  <Stack.Screen name="SystemStatus" component={HomeScreen} options={{ headerShown: true, headerTitle: 'System Status' }} />    
                </Stack.Group>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </>
      );
    };
