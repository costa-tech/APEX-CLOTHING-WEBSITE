import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 125430,
    totalOrders: 1234,
    totalProducts: 89,
    totalUsers: 5678,
    revenueChange: 12.5,
    ordersChange: -2.3,
    productsChange: 8.1,
    usersChange: 15.2,
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      amount: 159.99,
      status: 'Completed',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      amount: 89.50,
      status: 'Processing',
      date: '2024-01-15',
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      amount: 299.99,
      status: 'Shipped',
      date: '2024-01-14',
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      amount: 45.00,
      status: 'Pending',
      date: '2024-01-14',
    },
  ]);

  const [topProducts, setTopProducts] = useState([
    {
      id: 1,
      name: 'Athletic Performance Tee',
      sales: 234,
      revenue: 11699.66,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 2,
      name: 'Premium Training Shorts',
      sales: 189,
      revenue: 9449.11,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 3,
      name: 'Seamless Sports Bra',
      sales: 156,
      revenue: 7799.44,
      image: 'https://images.unsplash.com/photo-1506629905607-45c9e9e46934?w=100&h=100&fit=crop&crop=center',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, format = 'number' }) => {
    const isPositive = change >= 0;
    const formattedValue = format === 'currency' ? `$${value.toLocaleString()}` : value.toLocaleString();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formattedValue}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <Icon className="h-6 w-6 text-gray-600" />
          </div>
        </div>        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
    );
  };
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            change={stats.revenueChange}
            icon={CurrencyDollarIcon}
            format="currency"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            change={stats.ordersChange}
            icon={ShoppingCartIcon}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            change={stats.productsChange}
            icon={ShoppingBagIcon}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change={stats.usersChange}
            icon={UserGroupIcon}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.amount}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
                <Link
                  to="/admin/products"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/products/new"
              className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-colors group"
            >
              <ShoppingBagIcon className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-900">Add Product</h3>
              <p className="text-sm text-gray-600">Create a new product listing</p>
            </Link>
            
            <Link
              to="/admin/orders"
              className="p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:border-green-300 transition-colors group"
            >
              <ShoppingCartIcon className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-900">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and process orders</p>
            </Link>
            
            <Link
              to="/admin/users"
              className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-colors group"
            >
              <UserGroupIcon className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">Manage customer accounts</p>
            </Link>
            
            <Link
              to="/admin/analytics"
              className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200 hover:border-orange-300 transition-colors group"
            >
              <ChartBarIcon className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed reports</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
