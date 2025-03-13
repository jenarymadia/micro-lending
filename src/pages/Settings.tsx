import React from 'react';
import { Layout } from '../components/Layout';
import { useAppSelector } from '../store/hooks';
import { Building, Globe, Bell, Lock, Trash2 } from 'lucide-react';

export function Settings() {
  const { currentTenant } = useAppSelector((state) => state.tenant);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization settings and preferences.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {/* Organization Settings */}
            <div className="px-4 py-5 sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="flex items-center">
                    <Building className="h-6 w-6 text-gray-400" />
                    <h3 className="ml-2 text-lg font-medium leading-6 text-gray-900">Organization</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Basic information about your organization.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company-name"
                        id="company-name"
                        defaultValue={currentTenant?.name}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="px-4 py-5 sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="flex items-center">
                    <Bell className="h-6 w-6 text-gray-400" />
                    <h3 className="ml-2 text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your notification preferences.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="space-y-4">
                    {['Team updates', 'Security alerts', 'Billing notifications'].map((item) => (
                      <div key={item} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label className="font-medium text-gray-700">{item}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="px-4 py-5 sm:p-6 bg-red-50">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="flex items-center">
                    <Trash2 className="h-6 w-6 text-red-400" />
                    <h3 className="ml-2 text-lg font-medium leading-6 text-red-900">Danger Zone</h3>
                  </div>
                  <p className="mt-1 text-sm text-red-500">
                    Destructive actions that cannot be undone.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Organization
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}