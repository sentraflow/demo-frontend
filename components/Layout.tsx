import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { useLogout } from '@/hooks/use-auth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/" className="flex items-center text-xl font-bold text-primary-600">
                E-Commerce
              </Link>
              <div className="flex space-x-4 items-center">
                <Link href="/products" className="text-gray-700 hover:text-primary-600">
                  Products
                </Link>
                {isAuthenticated && (
                  <>
                    <Link href="/cart" className="text-gray-700 hover:text-primary-600">
                      Cart
                    </Link>
                    <Link href="/orders" className="text-gray-700 hover:text-primary-600">
                      Orders
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">
                    Welcome, {user?.name}
                  </span>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
