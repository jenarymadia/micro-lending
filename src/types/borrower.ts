export interface Borrower {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  socialsecuritynumber: string;
  creditscore: number;
  employmentstatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  employername?: string;
  monthlyincome: number;
  loanstatus: 'active' | 'pending' | 'completed' | 'defaulted';
  registrationdate: string;
  created_at?: string;
  updated_at?: string;
}

export interface BorrowerFormData extends Omit<Borrower, 'id' | 'created_at' | 'updated_at' | 'registrationdate'> {}

export interface BorrowerFilters {
  loanstatus?: Borrower['loanstatus'];
  employmentstatus?: Borrower['employmentstatus'];
  mincreditscore?: number;
  maxcreditscore?: number;
}