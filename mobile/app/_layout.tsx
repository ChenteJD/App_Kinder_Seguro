import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/lib/store';
import { socketService } from '../src/lib/socket';

export default function RootLayout() {
  const { token, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Evitar navegación si los segmentos aún no se inicializan correctamente
    if (!segments?.length) return;

    const inAuthGroup = segments[0] === '(app)';

    if (!user && inAuthGroup) {
      // No logueado tratando de entrar a (app)
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      // Logueado estando fuera de (app)
      router.replace('/(app)');
    }

    if (token) {
      socketService.connect(token);
    } else {
      socketService.disconnect();
    }
  }, [user, segments, token]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
