import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserTenants } from '../store/slices/tenantSlice';
import { useAuthStore } from '../store/authStore';
import { Layout } from './Layout';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAuthStore();
  const { currentTenant, isLoading, error } = useAppSelector((state) => state.tenant);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserTenants(user.id));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome to {currentTenant?.name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Add your dashboard content here */}
        </div>
      </div>
    </Layout>
  );
}