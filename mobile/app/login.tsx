import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/lib/store';
import { api } from '../src/lib/api';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, usuario } = response.data;
      setAuth(token, usuario);
    } catch (error: any) {
      Alert.alert('Error de acceso', error.response?.data?.error || 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titlePrimary}>Vínculo</Text>
        <Text style={styles.titleSecondary}>Preescolar</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo o Nombre de usuario</Text>
          <TextInput 
            style={styles.input}
            placeholder="correo@ejemplo.com o Vicente..."
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="default"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput}
              placeholder="******"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? "Ocultar" : "Ver"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#F9FAFB', padding: 24 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 32, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, borderColor: '#F3F4F6', borderWidth: 1 },
  titlePrimary: { fontSize: 48, fontWeight: '900', color: '#FF6B9D', marginBottom: 4 },
  titleSecondary: { fontSize: 32, fontWeight: '900', color: '#6BCB77', marginBottom: 32 },
  inputGroup: { width: '100%', marginBottom: 16 },
  label: { color: '#6B7280', fontWeight: 'bold', marginBottom: 8, marginLeft: 4 },
  input: { width: '100%', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, color: '#1F2937', borderColor: '#E5E7EB', borderWidth: 1 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, borderColor: '#E5E7EB', borderWidth: 1 },
  passwordInput: { flex: 1, padding: 16, color: '#1F2937' },
  eyeButton: { padding: 16, justifyContent: 'center', alignItems: 'center' },
  eyeText: { color: '#2196F3', fontWeight: 'bold', fontSize: 14 },
  button: { backgroundColor: '#2196F3', width: '100%', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});
