import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../components/Button';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../theme';

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
      
      if (response.data && response.data.token) {
        await signIn(response.data.token, response.data.user);
      } else {
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Join Velo<Text style={styles.titleHighlight}>.</Text></Text>
            <Text style={styles.subtitle}>Create an account to start your journey.</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail *"
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
                placeholder="Phone"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password *"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password *"
                placeholderTextColor={colors.textMuted}
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
              />
            </View>

            <Text style={styles.roleLabel}>I want to be a:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'passenger' && styles.roleButtonActive]}
                onPress={() => setRole('passenger')}
              >
                <Text style={[styles.roleText, role === 'passenger' && styles.roleTextActive]}>Passenger</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'driver' && styles.roleButtonActive]}
                onPress={() => setRole('driver')}
              >
                <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Driver</Text>
              </TouchableOpacity>
            </View>
            
            <Button 
              title={loading ? 'Creating Account...' : 'Sign Up'} 
              onPress={handleRegister} 
              disabled={loading}
            />
            
            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkHighlight}>Sign in</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    fontSize: 40,
    marginBottom: spacing.s,
    letterSpacing: -1,
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodyMuted,
    fontSize: 16,
  },
  form: {
    gap: spacing.m,
  },
  inputContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    padding: spacing.m,
    color: colors.text,
    fontSize: 16,
  },
  roleLabel: {
    ...typography.body,
    fontWeight: '600',
    marginTop: spacing.s,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  roleButton: {
    flex: 1,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  roleText: {
    ...typography.bodyMuted,
  },
  roleTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.s,
    padding: spacing.s,
  },
  loginLinkText: {
    ...typography.bodyMuted,
  },
  loginLinkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  }
});
