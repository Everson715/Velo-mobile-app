import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }
    
    try {
      setLoading(true);
      // Calls the Identity Driver Service via API Gateway
      const response = await api.post('/users/login', {
        email,
        password
      });
      
      if (response.data && response.data.token) {
        await signIn(response.data.token, response.data.user);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        // No need to navigate manually, App.tsx conditionally renders Home
      } else {
        Alert.alert('Erro', 'Resposta inesperada do servidor.');
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao realizar login. Verifique suas credenciais.');
      console.log('Login error:', error.response?.data || error.message);
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
        
        {/* Test bypass */}
        <Button 
          title="Pular Login (Modo Teste)" 
          variant="secondary"
          onPress={() => signIn('dummy-token', { id: 'test-id', name: 'Test User', email: 'test@velo.com', role: 'passenger' })} 
        />

        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLinkText}>Não possui conta? Cadastre-se</Text>
        </TouchableOpacity>
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
  registerLink: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  registerLinkText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});
