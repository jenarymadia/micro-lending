import './style.css';
import { supabase } from './lib/supabase';
import { Borrower } from './types';
import { format } from 'date-fns';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
}

async function fetchBorrowers() {
  const { data: borrowers, error } = await supabase
    .from('borrowers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching borrowers:', error);
    return [];
  }

  return borrowers;
}

async function addBorrower(formData: FormData) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Please sign in to add a borrower');
  }

  // Validate and parse form data
  const name = formData.get('name') as string;
  const funds = parseFloat(formData.get('funds') as string);
  const interest_per_month = parseFloat(formData.get('interest_per_month') as string);
  const payment_day = formData.get('payment_day') as string;
  const description = formData.get('description') as string;
  const start_date = formData.get('start_date') as string;

  // Validate required fields
  if (!name || !funds || !interest_per_month || !payment_day || !start_date) {
    throw new Error('Please fill in all required fields');
  }

  // Validate numeric fields
  if (isNaN(funds) || funds < 0) {
    throw new Error('Please enter a valid amount for funds');
  }

  if (isNaN(interest_per_month) || interest_per_month < 0) {
    throw new Error('Please enter a valid amount for interest per month');
  }

  const newBorrower = {
    name,
    status: 'On going',
    funds,
    interest_per_month,
    payment_day,
    description: description || null,
    start_date,
    user_id: user.id
  };

  const { error: insertError } = await supabase
    .from('borrowers')
    .insert([newBorrower]);

  if (insertError) {
    console.error('Insert error:', insertError);
    throw new Error(insertError.message);
  }
}

async function handleLogin(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const errorMessage = document.querySelector('.auth-error-message') as HTMLElement;
  errorMessage.textContent = '';

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    errorMessage.textContent = error.message;
    return;
  }

  await renderApp();
}

async function handleRegister(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const errorMessage = document.querySelector('.auth-error-message') as HTMLElement;
  errorMessage.textContent = '';

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    errorMessage.textContent = error.message;
    return;
  }

  errorMessage.textContent = 'Registration successful! Please sign in.';
  showLoginForm();
}

async function handleSignOut() {
  await supabase.auth.signOut();
  await renderApp();
}

function showLoginForm() {
  const authContainer = document.querySelector('.auth-container') as HTMLElement;
  authContainer.innerHTML = `
    <form onsubmit="window.handleLogin(event)" class="auth-form">
      <h2>Sign In</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div class="auth-error-message"></div>
      <button type="submit" class="submit-button">Sign In</button>
      <p class="auth-switch">
        Don't have an account? 
        <a href="#" onclick="window.showRegisterForm(); return false;">Register</a>
      </p>
    </form>
  `;
}

function showRegisterForm() {
  const authContainer = document.querySelector('.auth-container') as HTMLElement;
  authContainer.innerHTML = `
    <form onsubmit="window.handleRegister(event)" class="auth-form">
      <h2>Register</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="6">
      </div>
      <div class="auth-error-message"></div>
      <button type="submit" class="submit-button">Register</button>
      <p class="auth-switch">
        Already have an account? 
        <a href="#" onclick="window.showLoginForm(); return false;">Sign In</a>
      </p>
    </form>
  `;
}

function showModal() {
  const modal = document.querySelector('.modal') as HTMLElement;
  modal.classList.add('show');
}

function hideModal() {
  const modal = document.querySelector('.modal') as HTMLElement;
  modal.classList.remove('show');
}

async function handleSubmit(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const errorMessage = document.querySelector('.error-message') as HTMLElement;
  errorMessage.textContent = '';

  try {
    await addBorrower(formData);
    hideModal();
    form.reset();
    await renderBorrowers();
  } catch (error) {
    console.error('Error adding borrower:', error);
    errorMessage.textContent = error instanceof Error ? error.message : 'Error adding borrower. Please try again.';
  }
}

async function renderBorrowersList() {
  const borrowers = await fetchBorrowers();
  
  return `
    <div>
      <div class="header">
        <h1>Borrowers List</h1>
        <div class="header-actions">
          <button class="add-button" onclick="window.showModal()">Add Borrower</button>
          <button class="signout-button" onclick="window.handleSignOut()">Sign Out</button>
        </div>
      </div>
      <table class="borrowers-table">
        <thead>
          <tr>
            <th>Borrower</th>
            <th>Status</th>
            <th>Funds</th>
            <th>Interest/Month</th>
            <th>Payment Day</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Status for Month</th>
          </tr>
        </thead>
        <tbody>
          ${borrowers.map((borrower: Borrower) => `
            <tr>
              <td>${borrower.name}</td>
              <td>
                <span class="status-badge status-ongoing">${borrower.status}</span>
              </td>
              <td class="amount">${formatCurrency(borrower.funds)}</td>
              <td class="amount">${formatCurrency(borrower.interest_per_month)}</td>
              <td>${borrower.payment_day}</td>
              <td>${borrower.description || ''}</td>
              <td>${format(new Date(borrower.start_date), 'MMMM d, yyyy')}</td>
              <td>${borrower.status_for_month || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Add New Borrower</h2>
            <button class="close-button" onclick="window.hideModal()">&times;</button>
          </div>
          <form onsubmit="window.handleSubmit(event)">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="funds">Funds</label>
              <input type="number" id="funds" name="funds" step="0.01" min="0" required>
            </div>
            <div class="form-group">
              <label for="interest_per_month">Interest per Month</label>
              <input type="number" id="interest_per_month" name="interest_per_month" step="0.01" min="0" required>
            </div>
            <div class="form-group">
              <label for="payment_day">Payment Day</label>
              <input type="text" id="payment_day" name="payment_day" placeholder="e.g., every 2nd of the month" required>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" name="description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="start_date">Start Date</label>
              <input type="date" id="start_date" name="start_date" required>
            </div>
            <div class="error-message"></div>
            <button type="submit" class="submit-button">Add Borrower</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

async function renderApp() {
  const { data: { user } } = await supabase.auth.getUser();
  const appContainer = document.querySelector<HTMLDivElement>('#app')!;

  if (!user) {
    appContainer.innerHTML = `
      <div class="auth-container">
        <form onsubmit="window.handleLogin(event)" class="auth-form">
          <h2>Sign In</h2>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="auth-error-message"></div>
          <button type="submit" class="submit-button">Sign In</button>
          <p class="auth-switch">
            Don't have an account? 
            <a href="#" onclick="window.showRegisterForm(); return false;">Register</a>
          </p>
        </form>
      </div>
    `;
  } else {
    appContainer.innerHTML = await renderBorrowersList();
  }

  // Add global functions
  (window as any).showModal = showModal;
  (window as any).hideModal = hideModal;
  (window as any).handleSubmit = handleSubmit;
  (window as any).handleLogin = handleLogin;
  (window as any).handleRegister = handleRegister;
  (window as any).showLoginForm = showLoginForm;
  (window as any).showRegisterForm = showRegisterForm;
  (window as any).handleSignOut = handleSignOut;
}

// Initial render
renderApp();