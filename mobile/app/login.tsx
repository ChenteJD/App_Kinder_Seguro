import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/lib/store';
import { api } from '../src/lib/api';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, usuario } = response.data;
      setAuth(token, usuario);
      // El layout root lo redirigirá a (app) automáticamente
    } catch (error: any) {
      Alert.alert('Error de acceso', error.response?.data?.error || 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-kinder-bg p-6">
      <View className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 items-center">
        <Text className="text-5xl font-extrabold text-kinder-petalos mb-1">Vínculo</Text>
        <Text className="text-3xl font-extrabold text-kinder-estrellas mb-8">Preescolar</Text>
        
        <View className="w-full mb-4">
          <Text className="text-gray-500 font-bold mb-2 ml-1">Correo Electrónico</Text>
          <TextInput 
            className="w-full bg-gray-50 p-4 rounded-xl text-gray-800 border border-gray-200"
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="w-full mb-8">
          <Text className="text-gray-500 font-bold mb-2 ml-1">Contraseña</Text>
          <TextInput 
            className="w-full bg-gray-50 p-4 rounded-xl text-gray-800 border border-gray-200"
            placeholder="******"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          className="bg-kinder-mar w-full p-4 rounded-2xl shadow-sm items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
