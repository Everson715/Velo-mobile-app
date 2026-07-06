import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';

export const HomeScreen = ({ navigation }: any) => {
  const [status, setStatus] = useState<string>('Verificando status...');
  const [loading, setLoading] = useState(true);

  const checkGatewayStatus = async () => {
    try {
      setLoading(true);
      // Attempting to hit the tracking-telemetry-service mock through the gateway
      // Using /tracking/ as it is a valid route
      const response = await api.get('/tracking/'); 
      setStatus('Gateway Respondeu! Status: 200 OK');
    } catch (error: any) {
      console.log('Gateway error:', error);
      setStatus('Erro de conexão com o Gateway. Ele está rodando na porta 80?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkGatewayStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da Infraestrutura</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ marginTop: 16 }} />
        ) : (
          <Text style={styles.statusText}>{status}</Text>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Acessar Serviços:</Text>
        <Button title="Trip Matching (Solicitar)" onPress={() => navigation.navigate('TripMatching')} />
        <Button title="Tracking Telemetry (Acompanhar)" onPress={() => navigation.navigate('Tracking')} />
        <Button title="Payment Finance (Pagar)" onPress={() => navigation.navigate('Payment')} />
        <Button title="Review Rating (Avaliar)" onPress={() => navigation.navigate('Review')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  card: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  infoContainer: {
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
  },
});
