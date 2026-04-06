import { Stack } from 'expo-router';
import { useAuthStore } from '../../src/lib/store';

export default function AppLayout() {
  const { user } = useAuthStore();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: user?.rol === 'tutor' ? 'Mis Pequeños' : 'Alumnos',
          headerStyle: { backgroundColor: '#FF6B9D' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </Stack>
  );
}
