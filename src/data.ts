import { Borrower } from './types';

export const borrowers: Borrower[] = [
  {
    name: 'Myke',
    status: 'On going',
    funds: 5000.00,
    interestPerMonth: 750.00,
    paymentDay: 'every 2nd of the month',
    description: '',
    startDate: 'December 1, 2024'
  },
  {
    name: 'Neslie',
    status: 'On going',
    funds: 20000.00,
    interestPerMonth: 1800.00,
    paymentDay: 'every 2nd of the month',
    description: 'Kay papa 20k',
    startDate: 'February 2, 2024'
  },
  // Add more borrowers here...
];