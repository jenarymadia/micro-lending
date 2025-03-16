import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle2, 
  Star,
  ArrowRight,
  Users,
  BarChart3,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Competitive Rates',
    description: 'Access industry-leading rates starting from 5.99% APR with flexible terms tailored to your needs.'
  },
  {
    icon: Clock,
    title: 'Fast Approval',
    description: 'Get instant decisions and funding as quick as 24 hours with our streamlined application process.'
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Bank-level security protecting your data with advanced encryption and compliance standards.'
  },
  {
    icon: CheckCircle2,
    title: 'Easy Process',
    description: 'Simple online application with minimal documentation required and dedicated support.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    content: 'The loan process was incredibly smooth. I got approved quickly and the rates were better than anywhere else.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Michael Chen',
    role: 'Tech Entrepreneur',
    content: 'Their platform made everything transparent and straightforward. Excellent service and support throughout.',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const stats = [
  { label: 'Active Borrowers', value: '10,000+' },
  { label: 'Total Funded', value: '$500M+' },
  { label: 'Average Approval Time', value: '24 hrs' },
  { label: 'Customer Satisfaction', value: '4.8/5' }
];

const pricingPlans = [
  {
    name: 'Personal Loan',
    price: '5.99%',
    description: 'For individuals seeking flexible financing',
    features: [
      'Borrow up to $50,000',
      'Terms from 12-60 months',
      'No prepayment penalties',
      'Fixed monthly payments'
    ]
  },
  {
    name: 'Business Loan',
    price: '6.99%',
    description: 'For established businesses',
    features: [
      'Borrow up to $250,000',
      'Flexible payment schedules',
      'Line of credit options',
      'Dedicated account manager'
    ]
  }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LoanPro</span>
            </div>
            <div className="flex items-center">
              <Link
                to="/auth"
                className="ml-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Smart financing for</span>
                  <span className="block text-indigo-600">your future growth</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Get quick access to competitive loans with transparent terms and a seamless digital experience. Apply in minutes, receive a decision today.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/apply"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/calculator"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Calculate Rates
                      <BarChart3 className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="Team working on finances"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in a modern lending platform
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-2 text-base font-medium text-indigo-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by thousands of customers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <img className="h-12 w-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-indigo-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500">{testimonial.content}</p>
                  <div className="mt-4 flex text-indigo-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Choose the right loan for you
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500"> APR</span>
                  </p>
                  <Link
                    to="/apply"
                    className="mt-8 block w-full bg-indigo-600 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700"
                  >
                    Apply Now
                  </Link>
                </div>
                <div className="px-6 pt-6 pb-8">
                  <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex">
                        <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-3 text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Apply now in just minutes.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of satisfied customers who have already received their loans.
          </p>
          <Link
            to="/apply"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Apply Now
            <Zap className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-base text-gray-500 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-base text-gray-500 hover:text-gray-900">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="mailto:support@loanpro.com" className="text-base text-gray-500 hover:text-gray-900">
                    support@loanpro.com
                  </a>
                </li>
                <li>
                  <a href="tel:1-800-123-4567" className="text-base text-gray-500 hover:text-gray-900">
                    1-800-123-4567
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              © {new Date().getFullYear()} LoanPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}