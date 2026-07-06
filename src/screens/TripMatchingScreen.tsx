import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';

export const TripMatchingScreen = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const requestTrip = async () => {
    if (!origin || !destination) {
      Alert.alert('Aviso', 'Preencha a origem e o destino.');
      return;
    }
    
    try {
      setLoading(true);
      // Calls API Gateway routed to Trip Matching Service
      await api.post('/api/v1/match/request', { origin, destination });
      Alert.alert('Sucesso', 'Corrida solicitada com sucesso!');
      setOrigin('');
      setDestination('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao solicitar corrida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Matching</Text>
      <Text style={styles.subtitle}>Encontre um motorista para sua viagem</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Local de Origem"
          value={origin}
          onChangeText={setOrigin}
        />
        <TextInput
          style={styles.input}
          placeholder="Destino"
          value={destination}
          onChangeText={setDestination}
        />
        <Button 
          title={loading ? 'Buscando...' : 'Solicitar Corrida'} 
          onPress={requestTrip} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  form: { gap: 16 },
  input: {
    borderWidth: 1, borderColor: '#E5E5E5', padding: 16, borderRadius: 8,
    fontSize: 16, backgroundColor: '#F9F9F9',
  },
});
