import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('kinddo_token') || null,
  user: JSON.parse(sessionStorage.getItem('kinddo_user') || 'null'),
  setAuth: (token, user) => {
    sessionStorage.setItem('kinddo_token', token);
    sessionStorage.setItem('kinddo_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    sessionStorage.removeItem('kinddo_token');
    sessionStorage.removeItem('kinddo_user');
    set({ token: null, user: null });
  },
}));
