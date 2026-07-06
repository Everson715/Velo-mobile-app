import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';

export const TrackingScreen = () => {
  const [telemetry, setTelemetry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      // Calls API Gateway routed to Tracking Telemetry Service
      const response = await api.get('/tracking/');
      // Mock data handling since it's a mock service in backend
      setTelemetry(JSON.stringify(response.data) || 'Lat: -23.5505, Lng: -46.6333 (Mock)');
    } catch (error) {
      setTelemetry('Falha ao conectar com o serviço de telemetria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking Telemetry</Text>
      <Text style={styles.subtitle}>Acompanhamento em tempo real</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Localização Atual do Veículo</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ marginTop: 16 }} />
        ) : (
          <Text style={styles.statusText}>{telemetry}</Text>
        )}
      </View>

      <Button title="Atualizar Posição" onPress={fetchTelemetry} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { padding: 20, backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5', marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  statusText: { fontSize: 16, color: '#444', marginTop: 8 },
});
