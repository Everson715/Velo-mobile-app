import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../theme';

interface Route {
  id: string;
  pickup: string;
  destination: string;
  price: string;
  distance: string;
}

export const DriverRoutesScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    // Simulate fetching available routes from the server
    const fetchRoutes = async () => {
      setLoading(true);
      setTimeout(() => {
        setRoutes([
          { id: '1', pickup: 'Downtown Center', destination: 'Airport', price: '$24.50', distance: '12km' },
          { id: '2', pickup: 'North Mall', destination: 'South Station', price: '$15.00', distance: '5km' },
          { id: '3', pickup: 'Central Park', destination: 'Westside Tech Hub', price: '$18.75', distance: '8km' },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchRoutes();
  }, []);

  const handleAcceptRoute = (routeId: string) => {
    // Navigate to tracking or accept route logic
    navigation.navigate('Tracking', { routeId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Driver, {user?.name?.split(' ')[0]}</Text>
          <Text style={styles.subtitle}>Here are your available routes today</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xxl }} />
        ) : (
          <View style={styles.routesContainer}>
            {routes.map(route => (
              <View key={route.id} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <Text style={styles.price}>{route.price}</Text>
                  <Text style={styles.distance}>{route.distance}</Text>
                </View>
                
                <View style={styles.locations}>
                  <View style={styles.locationItem}>
                    <View style={[styles.dot, styles.pickupDot]} />
                    <Text style={styles.locationText}>{route.pickup}</Text>
                  </View>
                  <View style={styles.locationLine} />
                  <View style={styles.locationItem}>
                    <View style={[styles.dot, styles.destDot]} />
                    <Text style={styles.locationText}>{route.destination}</Text>
                  </View>
                </View>

                <Button 
                  title="Accept Ride" 
                  onPress={() => handleAcceptRoute(route.id)}
                  style={styles.acceptButton}
                />
              </View>
            ))}
            
            {routes.length === 0 && (
              <Text style={styles.noRoutes}>No routes available right now.</Text>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Button title="Sign Out" onPress={signOut} variant="ghost" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.l,
    marginTop: spacing.m,
  },
  greeting: {
    ...typography.h2,
    fontSize: 28,
  },
  subtitle: {
    ...typography.bodyMuted,
    marginTop: spacing.xs,
  },
  routesContainer: {
    gap: spacing.m,
  },
  routeCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
  distance: {
    ...typography.caption,
    fontWeight: 'bold',
  },
  locations: {
    marginBottom: spacing.m,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.s,
  },
  pickupDot: {
    backgroundColor: colors.success,
  },
  destDot: {
    backgroundColor: colors.error,
  },
  locationLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 4,
    marginVertical: 4,
  },
  locationText: {
    ...typography.body,
  },
  acceptButton: {
    marginTop: spacing.s,
  },
  noRoutes: {
    ...typography.bodyMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  }
});
