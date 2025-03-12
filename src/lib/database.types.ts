export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      borrowers: {
        Row: {
          id: string
          name: string
          status: string
          funds: number
          interest_per_month: number
          payment_day: string
          description: string | null
          start_date: string
          status_for_month: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          status?: string
          funds: number
          interest_per_month: number
          payment_day: string
          description?: string | null
          start_date: string
          status_for_month?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          status?: string
          funds?: number
          interest_per_month?: number
          payment_day?: string
          description?: string | null
          start_date?: string
          status_for_month?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}