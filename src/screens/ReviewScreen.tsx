import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';

export const ReviewScreen = () => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!rating) {
      Alert.alert('Aviso', 'Dê uma nota para a corrida.');
      return;
    }

    try {
      setLoading(true);
      // Calls API Gateway routed to Review Rating Service
      await api.post('/api/v1/review/submit', { rating: parseInt(rating), comment });
      Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
      setRating('');
      setComment('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar avaliação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Rating</Text>
      <Text style={styles.subtitle}>Avalie sua última viagem</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nota (1 a 5)"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Comentários adicionais"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
        />
        <Button 
          title={loading ? 'Enviando...' : 'Enviar Avaliação'} 
          onPress={submitReview} 
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
  textArea: { height: 100, textAlignVertical: 'top' },
});
