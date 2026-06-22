import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/models';
import { TOKEN_KEY, USER_KEY } from '@/lib/constants';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken, refreshToken) => {
        // Store access token in sessionStorage (cleared on tab close)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(TOKEN_KEY, accessToken);
          localStorage.setItem('atp_refresh_token', refreshToken);
        }
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('atp_refresh_token');
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: USER_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);