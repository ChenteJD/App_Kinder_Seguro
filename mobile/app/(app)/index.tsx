import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../src/lib/store';
import { api } from '../../src/lib/api';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get('/alumnos');
      setData(res.data);
    } catch (error) {
      console.log('Error fetching alumnos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View className="flex-1 bg-kinder-bg">
      <ScrollView 
        className="flex-1 p-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 font-medium text-lg">Hola,</Text>
            <Text className="text-2xl font-bold text-gray-800">{user?.nombre}</Text>
            <View className="bg-kinder-girasoles self-start px-3 py-1 rounded-full mt-2">
              <Text className="text-white text-xs font-bold uppercase">{user?.rol}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} className="bg-gray-100 px-4 py-3 rounded-2xl">
            <Text className="text-gray-500 font-bold">Salir</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-bold text-gray-700 mb-4">
          {user?.rol === 'tutor' ? 'Tus hijos registrados' : 'Alumnos a tu cargo'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF6B9D" className="mt-8" />
        ) : data.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-gray-400 text-lg">No hay alumnos asignados aún.</Text>
          </View>
        ) : (
          data.map((alumno: any) => (
            <TouchableOpacity 
              key={alumno.id} 
              className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-gray-100 flex-row items-center border-l-4 border-l-kinder-petalos"
            >
              <View className="w-14 h-14 bg-gray-100 rounded-full mr-4 justify-center items-center border border-gray-200">
                <Text className="text-2xl">🧒</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-gray-800">{alumno.nombre} {alumno.apellido}</Text>
                <Text className="text-gray-500 font-medium">{alumno.grupo_nombre} - {alumno.grupo_nivel}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
