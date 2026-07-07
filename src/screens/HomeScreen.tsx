import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, SafeAreaView } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../theme';

export const HomeScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [status, setStatus] = useState<string>('Checking infrastructure status...');
  const [loading, setLoading] = useState(true);
  const [approvalLoading, setApprovalLoading] = useState(false);

  const checkGatewayStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tracking/'); 
      setStatus('Gateway is online! Status: 200 OK');
    } catch (error: any) {
      console.log('Gateway error:', error);
      setStatus('Connection failed. Is the API Gateway running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkGatewayStatus();
  }, []);

  const handleSimulateApproval = async () => {
    if (!user || !user.id) return;
    try {
      setApprovalLoading(true);
      const response = await api.post(`/drivers/${user.id}/approve`);
      Alert.alert('Sucesso', 'Motorista aprovado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao aprovar motorista.');
      console.log('Approval error:', error.response?.data || error.message);
    } finally {
      setApprovalLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
          <Text style={styles.roleBadge}>{user?.role?.toUpperCase() || 'PASSENGER'}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.statusDot, !loading && status.includes('online') ? styles.statusOnline : styles.statusOffline]} />
            <Text style={styles.cardTitle}>System Status</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.m }} />
          ) : (
            <Text style={styles.statusText}>{status}</Text>
          )}
        </View>

        {user?.role === 'driver' && (
          <View style={[styles.card, styles.highlightCard]}>
            <Text style={styles.cardTitle}>Driver Dashboard</Text>
            <Text style={styles.statusText}>
              As a driver, your account may need approval to start receiving ride requests.
            </Text>
            <View style={{ marginTop: spacing.m }}>
              <Button 
                title={approvalLoading ? 'Processing...' : 'Simulate Approval'} 
                onPress={handleSimulateApproval} 
                variant="secondary"
              />
            </View>
          </View>
        )}
        
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Button title="Trip Matching" onPress={() => navigation.navigate('TripMatching')} variant="secondary" />
            </View>
            <View style={styles.gridItem}>
              <Button title="Live Tracking" onPress={() => navigation.navigate('Tracking')} variant="secondary" />
            </View>
            <View style={styles.gridItem}>
              <Button title="Payments" onPress={() => navigation.navigate('Payment')} variant="secondary" />
            </View>
            <View style={styles.gridItem}>
              <Button title="Reviews" onPress={() => navigation.navigate('Review')} variant="secondary" />
            </View>
          </View>
        </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.l,
  },
  greeting: {
    ...typography.h2,
    fontSize: 28,
  },
  roleBadge: {
    ...typography.caption,
    color: colors.background,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: borderRadius.s,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlightCard: {
    borderColor: colors.primary,
    backgroundColor: '#0d1a26', // slightly blue-ish dark bg
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.s,
  },
  statusOnline: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  statusOffline: {
    backgroundColor: colors.error,
  },
  cardTitle: {
    ...typography.h3,
  },
  statusText: {
    ...typography.bodyMuted,
    lineHeight: 24,
  },
  servicesSection: {
    marginTop: spacing.m,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.m,
  },
  grid: {
    flexDirection: 'column',
    gap: spacing.s,
  },
  gridItem: {
    width: '100%',
  },
  footer: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  }
});
