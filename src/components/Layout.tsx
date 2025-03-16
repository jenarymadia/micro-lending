import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Building,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  ChevronLeft,
  ChevronRight,
  UserSquare2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuthStore();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Borrowers', href: '/borrowers', icon: UserSquare2 },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        to={item.href}
        className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 group ${
          isActive 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
        <span className={`
          ml-3 whitespace-nowrap
          ${!isExpanded ? 'lg:hidden' : ''}
          ${isActive ? 'font-medium' : ''}
        `}>
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-30
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isExpanded ? 'w-64' : 'w-20'}
        bg-white border-r border-gray-200
      `}>
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-indigo-600 flex-shrink-0" />
            {isExpanded && (
              <span className="ml-3 text-xl font-semibold text-gray-900 whitespace-nowrap">
                Company
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:block p-1 rounded-lg hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            {isExpanded && (
              <span className="ml-3">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'lg:pl-64' : 'lg:pl-20'}
      `}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-end">
              <div className="flex items-center space-x-4">
                {/* Add additional header content here */}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}