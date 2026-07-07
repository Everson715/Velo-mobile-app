import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../theme';

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
      
      // 1. Authenticate and get the JWT
      const loginResponse = await api.post('/auth/login', {
        email,
        password
      });
      
      const token = loginResponse.data.access_token || loginResponse.data.token;
      
      if (!token) {
        throw new Error('Token não retornado pelo servidor.');
      }

      // Temporarily set the token on the API headers to fetch the user profile
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 2. Fetch the user profile using the token
      const meResponse = await api.get('/me');
      const userData = meResponse.data.user;

      if (!userData) {
        throw new Error('Não foi possível carregar o perfil do usuário.');
      }

      // 3. Complete sign in
      await signIn(token, userData);

    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao realizar login. Verifique suas credenciais.');
      console.log('Login error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Velo<Text style={styles.titleHighlight}>.</Text></Text>
          <Text style={styles.subtitle}>Welcome back, speed racer.</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <Button 
            title={loading ? 'Authenticating...' : 'Sign In'} 
            onPress={handleLogin} 
            disabled={loading}
          />
          
          {/* Test bypass */}
          <Button 
            title="Bypass Login (Test Mode)" 
            variant="outline"
            onPress={() => signIn('dummy-token', { id: 'test-id', name: 'Test User', email: 'test@velo.com', role: 'passenger' } as any)} 
          />

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLinkText}>Don't have an account? <Text style={styles.registerLinkHighlight}>Sign up</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    fontSize: 48,
    marginBottom: spacing.s,
    letterSpacing: -1,
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodyMuted,
    fontSize: 18,
  },
  form: {
    gap: spacing.m,
  },
  inputContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
  },
  input: {
    padding: spacing.m,
    color: colors.text,
    fontSize: 16,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: spacing.l,
    padding: spacing.s,
  },
  registerLinkText: {
    ...typography.bodyMuted,
  },
  registerLinkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  }
});
