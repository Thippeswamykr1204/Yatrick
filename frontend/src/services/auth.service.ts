import api from './api';
import { AuthResponse } from '@/types/api';
import { User } from '@/types/models';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/register', input);
    return data.data as any;
  },

  async login(input: LoginInput): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/login', input);
    return data.data as any;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<{ data: User }>('/auth/me');
    return data.data;
  },

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { data } = await api.post<{
      data: { accessToken: string; refreshToken: string };
    }>('/auth/refresh', { refreshToken });
    return data.data;
  },
};