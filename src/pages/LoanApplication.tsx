import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CheckCircle2,
  AlertCircle,
  Upload,
  Save,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const schema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  dateOfBirth: z.string(),
  ssn: z.string().min(9, 'Valid SSN is required'),

  // Employment Information
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'retired']),
  employerName: z.string().optional(),
  monthlyIncome: z.number().min(0),
  yearsEmployed: z.number().min(0),

  // Loan Information
  loanAmount: z.number().min(1000).max(50000),
  loanPurpose: z.string().min(1, 'Loan purpose is required'),
  loanTerm: z.number(),

  // Financial Information
  bankName: z.string().min(1, 'Bank name is required'),
  accountType: z.enum(['checking', 'savings']),
  monthlyExpenses: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

const steps = [
  { id: 1, name: 'Personal Information' },
  { id: 2, name: 'Employment Details' },
  { id: 3, name: 'Loan Information' },
  { id: 4, name: 'Financial Details' },
  { id: 5, name: 'Document Upload' }
];

export function LoanApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [savedData, setSavedData] = useState<Partial<FormData>>({});

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: savedData
  });

  const employmentStatus = watch('employmentStatus');

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  const handleSave = () => {
    const formData = watch();
    setSavedData(formData);
    // Save to localStorage or backend
    toast.success('Application progress saved!');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Social Security Number</label>
                <input
                  type="password"
                  {...register('ssn')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.ssn && (
                  <p className="mt-1 text-sm text-red-600">{errors.ssn.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Employment Details</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                <select
                  {...register('employmentStatus')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              {(employmentStatus === 'employed' || employmentStatus === 'self-employed') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {employmentStatus === 'self-employed' ? 'Business Name' : 'Employer Name'}
                    </label>
                    <input
                      type="text"
                      {...register('employerName')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years Employed</label>
                    <input
                      type="number"
                      {...register('yearsEmployed', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Income</label>
                <input
                  type="number"
                  {...register('monthlyIncome', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.monthlyIncome && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyIncome.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Loan Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
                <input
                  type="number"
                  {...register('loanAmount', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.loanAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.loanAmount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Term (months)</label>
                <select
                  {...register('loanTerm', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                  <option value={48}>48 months</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Loan Purpose</label>
                <textarea
                  {...register('loanPurpose')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.loanPurpose && (
                  <p className="mt-1 text-sm text-red-600">{errors.loanPurpose.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Financial Details</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  {...register('bankName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  {...register('accountType')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Expenses</label>
                <input
                  type="number"
                  {...register('monthlyExpenses', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Document Upload</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Proof of Income</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Government ID</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={`${
                  stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                } relative`}
              >
                {step.id < currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-indigo-600" />
                    </div>
                    <button
                      type="button"
                      className="relative w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-900"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : step.id === currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <button
                      type="button"
                      className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full"
                      aria-current="step"
                    >
                      <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <button
                      type="button"
                      className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full"
                    >
                      <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover: bg-indigo-700"
                >
                  Submit Application
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Required Documents Checklist */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Required Documents Checklist</h4>
          <ul className="space-y-3">
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              Government-issued ID (Driver's License or Passport)
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              Proof of Income (Pay Stubs or Tax Returns)
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              Bank Statements (Last 3 months)
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              Proof of Address (Utility Bill or Lease Agreement)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}