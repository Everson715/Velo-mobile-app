import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';

export const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const processPayment = async () => {
    if (!amount) {
      Alert.alert('Aviso', 'Insira um valor para pagamento.');
      return;
    }

    try {
      setLoading(true);
      // Calls API Gateway routed to Payment Finance Service
      await api.post('/api/v1/payments/process', { amount: parseFloat(amount) });
      Alert.alert('Sucesso', 'Pagamento processado com sucesso!');
      setAmount('');
    } catch (error) {
      Alert.alert('Erro', 'Falha no serviço de pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Finance</Text>
      <Text style={styles.subtitle}>Realizar pagamento de pendências</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Valor (R$)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Button 
          title={loading ? 'Processando...' : 'Pagar Agora'} 
          onPress={processPayment} 
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
