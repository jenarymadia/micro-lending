import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { SupabaseDataModule } from '../lib/supabaseDataModule';
import { Borrower, BorrowerFormData, BorrowerFilters } from '../types/borrower';
import { BorrowerForm } from '../components/BorrowerForm';
import { BorrowerTable } from '../components/BorrowerTable';
import { Search, Filter, Download, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { stringify } from 'csv-stringify/browser/esm/sync';

const borrowerModule = new SupabaseDataModule<Borrower>({
  tableName: 'borrowers',
  maxRetries: 3,
});

export function Borrowers() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [filters, setFilters] = useState<BorrowerFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBorrowers = async () => {
    setLoading(true);
    try {
      let query = borrowerModule.client
        .from('borrowers')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (filters.loanstatus) {
        query = query.eq('loanstatus', filters.loanstatus);
      }

      if (filters.employmentstatus) {
        query = query.eq('employmentstatus', filters.employmentstatus);
      }

      if (filters.mincreditscore) {
        query = query.gte('creditscore', filters.mincreditscore);
      }

      if (filters.maxcreditscore) {
        query = query.lte('creditscore', filters.maxcreditscore);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBorrowers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      toast.error('Failed to fetch borrowers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, [page, limit, filters, searchTerm]);

  const handleCreate = async (data: BorrowerFormData) => {
    try {
      const { error } = await borrowerModule.create({
        ...data,
        registrationdate: new Date().toISOString(),
      });
      
      if (error) throw error;
      
      toast.success('Borrower created successfully');
      setShowForm(false);
      fetchBorrowers();
    } catch (error) {
      toast.error('Failed to create borrower');
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, data: Partial<BorrowerFormData>) => {
    try {
      const { error } = await borrowerModule.update(id, data);
      
      if (error) throw error;
      
      toast.success('Borrower updated successfully');
      setEditingBorrower(null);
      fetchBorrowers();
    } catch (error) {
      toast.error('Failed to update borrower');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this borrower?')) {
      return;
    }

    try {
      const { error } = await borrowerModule.delete(id);
      
      if (error) throw error;
      
      toast.success('Borrower deleted successfully');
      fetchBorrowers();
    } catch (error) {
      toast.error('Failed to delete borrower');
      console.error(error);
    }
  };

  const exportToCsv = () => {
    try {
      const csvData = stringify(borrowers, {
        header: true,
        columns: {
          firstname: 'First Name',
          lastname: 'Last Name',
          email: 'Email',
          phone: 'Phone',
          address: 'Address',
          creditscore: 'Credit Score',
          employmentstatus: 'Employment Status',
          monthlyincome: 'Monthly Income',
          loanstatus: 'Loan Status',
          registrationdate: 'Registration Date',
        },
      });

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `borrowers-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Borrowers</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage borrower information and loan status
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={exportToCsv}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              New Borrower
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search borrowers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <button
                onClick={() => setFilters({})}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          <BorrowerTable
            borrowers={borrowers}
            loading={loading}
            onEdit={setEditingBorrower}
            onDelete={handleDelete}
            page={page}
            limit={limit}
            total={totalCount}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>

        {(showForm || editingBorrower) && (
          <BorrowerForm
            borrower={editingBorrower}
            onSubmit={editingBorrower ? 
              (data) => handleUpdate(editingBorrower.id, data) : 
              handleCreate}
            onClose={() => {
              setShowForm(false);
              setEditingBorrower(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}