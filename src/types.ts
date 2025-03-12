export interface Borrower {
  id: string;
  name: string;
  status: string;
  funds: number;
  interest_per_month: number;
  payment_day: string;
  description: string | null;
  start_date: string;
  status_for_month: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}