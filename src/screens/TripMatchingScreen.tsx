import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../theme';

export const TripMatchingScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const requestTrip = async () => {
    if (!origin || !destination) {
      Alert.alert('Hold up!', 'Please provide both origin and destination.');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/match/request', { origin, destination });
      Alert.alert('Success', 'Your ride has been requested!');
      setOrigin('');
      setDestination('');
      // Navigate to tracking
      navigation.navigate('Tracking');
    } catch (error) {
      Alert.alert('Error', 'Failed to request a ride.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Ready to go, {user?.name?.split(' ')[0]}?</Text>
            <Text style={styles.subtitle}>Where can we take you today?</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <View style={[styles.dot, styles.pickupDot]} />
              <TextInput
                style={styles.input}
                placeholder="Current Location (Origin)"
                placeholderTextColor={colors.textMuted}
                value={origin}
                onChangeText={setOrigin}
              />
            </View>
            <View style={styles.locationLine} />
            <View style={styles.inputContainer}>
              <View style={[styles.dot, styles.destDot]} />
              <TextInput
                style={styles.input}
                placeholder="Where to? (Destination)"
                placeholderTextColor={colors.textMuted}
                value={destination}
                onChangeText={setDestination}
              />
            </View>
            
            <Button 
              title={loading ? 'Searching for drivers...' : 'Request Ride'} 
              onPress={requestTrip} 
              disabled={loading}
              style={{ marginTop: spacing.m }}
            />
          </View>

          <View style={styles.footer}>
            <Button title="My Payments" onPress={() => navigation.navigate('Payment')} variant="secondary" />
            <Button title="My Reviews" onPress={() => navigation.navigate('Review')} variant="secondary" />
            <Button title="Sign Out" onPress={signOut} variant="ghost" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.s,
  },
  input: {
    flex: 1,
    padding: spacing.m,
    color: colors.text,
    fontSize: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: spacing.s,
  },
  pickupDot: {
    backgroundColor: colors.success,
  },
  destDot: {
    backgroundColor: colors.primary,
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 27, // aligns with dot
    marginVertical: 2,
  },
  footer: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
    gap: spacing.s,
  }
});
