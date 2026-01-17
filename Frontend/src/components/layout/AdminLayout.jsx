import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  TicketIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Coupons', href: '/admin/coupons', icon: TicketIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full border-r border-gray-200">
          <div className="flex items-center justify-between px-4 pt-5 pb-4">
            <Link to="/" className="flex items-center" onClick={closeSidebar}>
              <span className="text-2xl font-bold text-gray-900">ADMIN</span>
            </Link>
            <button
              onClick={closeSidebar}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <Link
              to="/"
              onClick={closeSidebar}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Back to Store
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">ADMIN</span>
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link
              to="/"
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Back to Store
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile header with menu button */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-medium text-gray-900">Admin Panel</h1>
            <Link
              to="/"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Store
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
