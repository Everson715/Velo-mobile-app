import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      // Calls the Identity Driver Service via API Gateway
      // The exact endpoint depends on the implementation, for now let's use a dummy one
      // based on the requirements for JWT issuing
      const response = await api.post('/api/v1/auth/login', {
        email,
        password
      });
      
      // In a real app we would save the token here
      // await AsyncStorage.setItem('jwt', response.data.token);
      
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar login. Verifique se a infraestrutura está rodando.');
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velo App</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button 
          title={loading ? 'Carregando...' : 'Entrar'} 
          onPress={handleLogin} 
        />
        <Button 
          title="Pular Login (Teste)" 
          variant="secondary"
          onPress={() => navigation.replace('Home')} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
});
