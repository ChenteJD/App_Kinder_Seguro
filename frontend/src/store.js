import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('vinculo_token') || null,
  user: JSON.parse(sessionStorage.getItem('vinculo_user') || 'null'),
  setAuth: (token, user) => {
    sessionStorage.setItem('vinculo_token', token);
    sessionStorage.setItem('vinculo_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    sessionStorage.removeItem('vinculo_token');
    sessionStorage.removeItem('vinculo_user');
    set({ token: null, user: null });
  },
}));
