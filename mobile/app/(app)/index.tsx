import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <ScrollView 
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.headerGreeting}>Hola,</Text>
            <Text style={styles.headerName}>{user?.nombre}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.rol}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          {user?.rol === 'tutor' ? 'Tus hijos registrados' : 'Alumnos a tu cargo'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF6B9D" style={{marginTop: 32}} />
        ) : data.length === 0 ? (
          <View style={{alignItems: 'center', marginTop: 40}}>
            <Text style={{color: '#9CA3AF', fontSize: 18}}>No hay alumnos asignados aún.</Text>
          </View>
        ) : (
          data.map((alumno: any) => (
            <TouchableOpacity key={alumno.id} style={styles.itemCard}>
              <View style={styles.itemAvatar}>
                <Text style={{fontSize: 24}}>🧒</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.itemName}>{alumno.nombre} {alumno.apellido}</Text>
                <Text style={styles.itemGroup}>{alumno.grupo_nombre} - {alumno.grupo_nivel}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1, padding: 24 },
  headerCard: { backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, borderColor: '#F3F4F6', borderWidth: 1 },
  headerGreeting: { color: '#6B7280', fontSize: 16, fontWeight: '500' },
  headerName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  roleBadge: { backgroundColor: '#FFD93D', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  roleText: { color: 'white', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  logoutBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  logoutText: { color: '#6B7280', fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#374151', marginBottom: 16 },
  itemCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#FF6B9D', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  itemAvatar: { width: 56, height: 56, backgroundColor: '#F3F4F6', borderRadius: 28, marginRight: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  itemName: { fontWeight: 'bold', fontSize: 18, color: '#1F2937' },
  itemGroup: { color: '#6B7280', fontWeight: '500', marginTop: 4 }
});
