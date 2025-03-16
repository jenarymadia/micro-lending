// Base interface for all database records
export interface BaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Generic database response type
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

// Data module configuration
export interface DataModuleConfig {
  tableName: string;
  maxRetries?: number;
  retryDelay?: number;
}