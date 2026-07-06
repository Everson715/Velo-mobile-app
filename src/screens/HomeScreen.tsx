import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const HomeScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [status, setStatus] = useState<string>('Verificando status...');
  const [loading, setLoading] = useState(true);
  const [approvalLoading, setApprovalLoading] = useState(false);

  const checkGatewayStatus = async () => {
    try {
      setLoading(true);
      // Attempting to hit the tracking-telemetry-service mock through the gateway
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.name?.split(' ')[0] || 'Usuário'}!</Text>
        <Text style={styles.subtitle}>Papel: {user?.role}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da Infraestrutura</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ marginTop: 16 }} />
        ) : (
          <Text style={styles.statusText}>{status}</Text>
        )}
      </View>

      {user?.role === 'driver' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Painel do Motorista</Text>
          <Text style={styles.statusText}>
            Como motorista, sua conta pode precisar de aprovação para receber corridas.
          </Text>
          <View style={{ marginTop: 12 }}>
            <Button 
              title={approvalLoading ? 'Processando...' : 'Simular Aprovação (Admin)'} 
              onPress={handleSimulateApproval} 
              variant="secondary"
            />
          </View>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Acessar Serviços:</Text>
        <Button title="Trip Matching (Solicitar)" onPress={() => navigation.navigate('TripMatching')} />
        <Button title="Tracking Telemetry (Acompanhar)" onPress={() => navigation.navigate('Tracking')} />
        <Button title="Payment Finance (Pagar)" onPress={() => navigation.navigate('Payment')} />
        <Button title="Review Rating (Avaliar)" onPress={() => navigation.navigate('Review')} />
      </View>

      <View style={{ marginTop: 32 }}>
        <Button title="Sair da Conta" onPress={signOut} variant="secondary" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
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
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  infoContainer: {
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
