import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Generic type for database records
interface BaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Generic response type
interface DataResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// Configuration options for the data module
interface DataModuleConfig {
  tableName: string;
  maxRetries?: number;
  retryDelay?: number;
}

export class SupabaseDataModule<T extends BaseRecord> {
  private client: SupabaseClient;
  private tableName: string;
  private maxRetries: number;
  private retryDelay: number;
  private cache: Map<string, { data: T; timestamp: number }>;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  constructor(config: DataModuleConfig) {
    this.client = supabase;
    this.tableName = config.tableName;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.cache = new Map();
  }

  /**
   * Validates the input data against required fields
   * @param data The data to validate
   * @returns boolean indicating if the data is valid
   */
  private validateData(data: Partial<T>): boolean {
    // Add your validation logic here
    if (!data || typeof data !== 'object') {
      return false;
    }
    return true;
  }

  /**
   * Handles errors from Supabase operations
   * @param error The error to handle
   * @returns Formatted error object
   */
  private handleError(error: PostgrestError | null): Error | null {
    if (!error) return null;
    return new Error(`Database error: ${error.message}`);
  }

  /**
   * Implements retry logic for failed requests
   * @param operation The operation to retry
   * @returns The operation result
   */
  private async withRetry<R>(operation: () => Promise<R>): Promise<R> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }
    
    throw lastError || new Error('Operation failed after retries');
  }

  /**
   * Creates a new record
   * @param data The data to create
   * @returns The created record
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<DataResponse<T>> {
    try {
      if (!this.validateData(data)) {
        throw new Error('Invalid data provided');
      }

      const result = await this.withRetry(async () => {
        const { data: created, error } = await this.client
          .from(this.tableName)
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return created as T;
      });

      return { data: result, error: null, loading: false };
    } catch (error) {
      return { data: null, error: error as Error, loading: false };
    }
  }

  /**
   * Retrieves a record by ID
   * @param id The ID of the record to retrieve
   * @returns The retrieved record
   */
  async getById(id: string): Promise<DataResponse<T>> {
    try {
      // Check cache first
      const cached = this.cache.get(id);
      if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
        return { data: cached.data, error: null, loading: false };
      }

      const result = await this.withRetry(async () => {
        const { data, error } = await this.client
          .from(this.tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as T;
      });

      // Update cache
      this.cache.set(id, { data: result, timestamp: Date.now() });

      return { data: result, error: null, loading: false };
    } catch (error) {
      return { data: null, error: error as Error, loading: false };
    }
  }

  /**
   * Updates an existing record
   * @param id The ID of the record to update
   * @param data The data to update
   * @returns The updated record
   */
  async update(id: string, data: Partial<T>): Promise<DataResponse<T>> {
    try {
      if (!this.validateData(data)) {
        throw new Error('Invalid data provided');
      }

      const result = await this.withRetry(async () => {
        const { data: updated, error } = await this.client
          .from(this.tableName)
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return updated as T;
      });

      // Invalidate cache
      this.cache.delete(id);

      return { data: result, error: null, loading: false };
    } catch (error) {
      return { data: null, error: error as Error, loading: false };
    }
  }

  /**
   * Deletes a record
   * @param id The ID of the record to delete
   * @returns Success status
   */
  async delete(id: string): Promise<DataResponse<boolean>> {
    try {
      await this.withRetry(async () => {
        const { error } = await this.client
          .from(this.tableName)
          .delete()
          .eq('id', id);

        if (error) throw error;
      });

      // Invalidate cache
      this.cache.delete(id);

      return { data: true, error: null, loading: false };
    } catch (error) {
      return { data: false, error: error as Error, loading: false };
    }
  }

  /**
   * Lists records with pagination and filtering
   * @param options Query options
   * @returns List of records
   */
  async list(options: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  } = {}): Promise<DataResponse<T[]>> {
    try {
      const { page = 1, limit = 10, filters = {} } = options;
      const offset = (page - 1) * limit;

      const result = await this.withRetry(async () => {
        let query = this.client
          .from(this.tableName)
          .select('*')
          .range(offset, offset + limit - 1);

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });

        const { data, error } = await query;
        if (error) throw error;
        return data as T[];
      });

      return { data: result, error: null, loading: false };
    } catch (error) {
      return { data: null, error: error as Error, loading: false };
    }
  }

  /**
   * Clears the cache for this table
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Example usage:
/*
interface User extends BaseRecord {
  email: string;
  name: string;
}

const userModule = new SupabaseDataModule<User>({
  tableName: 'users',
  maxRetries: 3,
  retryDelay: 1000,
});

// Create a user
const { data: newUser, error } = await userModule.create({
  email: 'user@example.com',
  name: 'John Doe',
});

// Get a user
const { data: user } = await userModule.getById('123');

// Update a user
const { data: updatedUser } = await userModule.update('123', {
  name: 'Jane Doe',
});

// Delete a user
const { data: deleted } = await userModule.delete('123');

// List users with pagination and filters
const { data: users } = await userModule.list({
  page: 1,
  limit: 10,
  filters: {
    role: 'admin',
  },
});
*/