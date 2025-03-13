import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { TenantState, Tenant, UserTenant } from '../../types/tenant';

// Initial state with proper typing
const initialState: TenantState = {
  currentTenant: null,
  userTenants: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching user's tenants
export const fetchUserTenants = createAsyncThunk(
  'tenant/fetchUserTenants',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('users_tenants')
        .select(`
          user_id,
          tenant_id,
          role,
          tenant:tenants (
            id,
            name,
            created_at
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserTenant[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for creating a new tenant
export const createTenant = createAsyncThunk(
  'tenant/createTenant',
  async ({ userId, email }: { userId: string; email: string }, { rejectWithValue }) => {
    try {
      // Create new tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert([{ name: `${email}'s Organization` }])
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Assign user to tenant
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

      return tenant as Tenant;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Tenant slice with reducers and actions
const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action: PayloadAction<Tenant | null>) => {
      state.currentTenant = action.payload;
    },
    clearTenantState: (state) => {
      state.currentTenant = null;
      state.userTenants = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUserTenants
    builder
      .addCase(fetchUserTenants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTenants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTenants = action.payload;
        // Set current tenant to the first one if none is selected
        if (!state.currentTenant && action.payload.length > 0) {
          state.currentTenant = action.payload[0].tenant ?? null;
        }
      })
      .addCase(fetchUserTenants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle createTenant
      .addCase(createTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTenant = action.payload;
        state.userTenants.push({
          user_id: '', // Will be set by the backend
          tenant_id: action.payload.id,
          role: 'owner',
          tenant: action.payload,
        });
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentTenant, clearTenantState } = tenantSlice.actions;
export default tenantSlice.reducer;