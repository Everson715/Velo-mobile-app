import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    
    if (password !== passwordConfirmation) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
        phone
      };

      const response = await api.post('/users/register', payload);
      
      // Assume the response includes { token, user: { id, name, email, role, phone } }
      if (response.data && response.data.token) {
        await signIn(response.data.token, response.data.user);
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        // No need to navigate manually if App.tsx listens to user state, 
        // but if it's manual:
        // navigation.replace('Home');
      } else {
        // If api doesn't return token immediately, redirect to login
        Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      Alert.alert('Erro', 'Falha ao realizar cadastro. Verifique os dados ou tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Junte-se à Velo</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo *"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail *"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha *"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
        />

        <Text style={styles.roleLabel}>Eu quero ser um:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'passenger' && styles.roleButtonActive]}
            onPress={() => setRole('passenger')}
          >
            <Text style={[styles.roleText, role === 'passenger' && styles.roleTextActive]}>Passageiro</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'driver' && styles.roleButtonActive]}
            onPress={() => setRole('driver')}
          >
            <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Motorista</Text>
          </TouchableOpacity>
        </View>
        
        <Button 
          title={loading ? 'Cadastrando...' : 'Cadastrar'} 
          onPress={handleRegister} 
        />
        
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>Já possui uma conta? Faça Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 24,
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
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});
