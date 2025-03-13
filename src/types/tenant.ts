export interface Tenant {
  id: string;
  name: string;
  created_at?: string;
}

export interface UserTenant {
  user_id: string;
  tenant_id: string;
  role: 'owner' | 'admin' | 'member';
  tenant?: Tenant;
}

export interface TenantState {
  currentTenant: Tenant | null;
  userTenants: UserTenant[];
  isLoading: boolean;
  error: string | null;
}