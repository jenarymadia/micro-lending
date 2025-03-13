import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAndAssignTenant: (userId: string, email: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  clearError: () => set({ error: null }),
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      set({ user: data.user, loading: false });
      
      // Check if user has a tenant
      if (data.user) {
        const { data: tenantData } = await supabase
          .from('users_tenants')
          .select('tenant_id')
          .eq('user_id', data.user.id)
          .single();

        if (!tenantData) {
          await get().createAndAssignTenant(data.user.id, data.user.email || '');
        }
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      set({ user: data.user, loading: false });
      
      // Create and assign tenant for new user
      if (data.user) {
        await get().createAndAssignTenant(data.user.id, email);
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  createAndAssignTenant: async (userId: string, email: string) => {
    try {
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert([{ name: `${email}'s Organization` }])
        .select()
        .single();

      if (tenantError) throw tenantError;

      const { error: assignError } = await supabase
        .from('users_tenants')
        .insert([
          {
            user_id: userId,
            tenant_id: tenant.id,
            role: 'owner',
          },
        ]);

      if (assignError) throw assignError;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));