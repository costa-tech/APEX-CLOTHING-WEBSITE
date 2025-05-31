import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Mock analytics data
  const analyticsData = {
    revenue: {
      current: 45239.50,
      previous: 38420.30,
      change: 17.8,
      trend: 'up',
    },
    orders: {
      current: 1247,
      previous: 1089,
      change: 14.5,
      trend: 'up',
    },
    visitors: {
      current: 8945,
      previous: 9234,
      change: -3.1,
      trend: 'down',
    },
    conversion: {
      current: 3.42,
      previous: 3.18,
      change: 7.5,
      trend: 'up',
    },
  };

  const salesData = [
    { date: 'Jan 1', revenue: 2400, orders: 24 },
    { date: 'Jan 2', revenue: 3200, orders: 32 },
    { date: 'Jan 3', revenue: 2800, orders: 28 },
    { date: 'Jan 4', revenue: 4100, orders: 41 },
    { date: 'Jan 5', revenue: 3600, orders: 36 },
    { date: 'Jan 6', revenue: 4800, orders: 48 },
    { date: 'Jan 7', revenue: 5200, orders: 52 },
    { date: 'Jan 8', revenue: 4600, orders: 46 },
    { date: 'Jan 9', revenue: 5800, orders: 58 },
    { date: 'Jan 10', revenue: 6200, orders: 62 },
    { date: 'Jan 11', revenue: 5400, orders: 54 },
    { date: 'Jan 12', revenue: 6800, orders: 68 },
    { date: 'Jan 13', revenue: 7200, orders: 72 },
    { date: 'Jan 14', revenue: 6600, orders: 66 },
  ];

  const categoryData = [
    { name: 'Tops', value: 35, count: 437 },
    { name: 'Bottoms', value: 28, count: 349 },
    { name: 'Activewear', value: 22, count: 274 },
    { name: 'Accessories', value: 15, count: 187 },
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Athletic Performance Tee',
      sales: 234,
      revenue: 11696.66,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 2,
      name: 'Premium Training Shorts',
      sales: 189,
      revenue: 11338.11,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 3,
      name: 'Seamless Sports Bra',
      sales: 156,
      revenue: 6238.44,
      image: 'https://images.unsplash.com/photo-1506629905607-45c9e9e46934?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 4,
      name: 'Ultra Flex Leggings',
      sales: 143,
      revenue: 10004.57,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center',
    },
  ];

  const trafficData = [
    { source: 'Direct', visitors: 3245, percentage: 36.3 },
    { source: 'Social Media', visitors: 2567, percentage: 28.7 },
    { source: 'Search Engines', visitors: 1834, percentage: 20.5 },
    { source: 'Email', visitors: 892, percentage: 10.0 },
    { source: 'Referrals', visitors: 407, percentage: 4.5 },
  ];

  const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getChangeColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };
  const getChangeIcon = (trend) => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="w-4 h-4" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">Insights and performance metrics</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analyticsData.revenue.current)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className={`flex items-center mt-2 text-sm ${getChangeColor(analyticsData.revenue.trend)}`}>
              {getChangeIcon(analyticsData.revenue.trend)}
              <span className="ml-1">
                {analyticsData.revenue.change > 0 ? '+' : ''}{analyticsData.revenue.change}%
              </span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.orders.current)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className={`flex items-center mt-2 text-sm ${getChangeColor(analyticsData.orders.trend)}`}>
              {getChangeIcon(analyticsData.orders.trend)}
              <span className="ml-1">
                {analyticsData.orders.change > 0 ? '+' : ''}{analyticsData.orders.change}%
              </span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.visitors.current)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className={`flex items-center mt-2 text-sm ${getChangeColor(analyticsData.visitors.trend)}`}>
              {getChangeIcon(analyticsData.visitors.trend)}
              <span className="ml-1">
                {analyticsData.visitors.change > 0 ? '+' : ''}{analyticsData.visitors.change}%
              </span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.conversion.current}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className={`flex items-center mt-2 text-sm ${getChangeColor(analyticsData.conversion.trend)}`}>
              {getChangeIcon(analyticsData.conversion.trend)}
              <span className="ml-1">
                {analyticsData.conversion.change > 0 ? '+' : ''}{analyticsData.conversion.change}%
              </span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue & Orders</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#000000" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Sales Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 text-sm font-medium text-gray-500 w-6">
                    #{index + 1}
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {trafficData.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {source.source}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {formatNumber(source.visitors)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
