import { motion } from 'framer-motion';

const Investors = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investor Relations</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Information for current and prospective investors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Annual Revenue (2024)</p>
                  <p className="text-3xl font-bold text-gray-900">$45.2M</p>
                  <p className="text-sm text-green-600 mt-1">↑ 45% YoY</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Gross Margin</p>
                  <p className="text-3xl font-bold text-gray-900">58%</p>
                  <p className="text-sm text-green-600 mt-1">↑ 3% YoY</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Active Customers</p>
                  <p className="text-3xl font-bold text-gray-900">125K</p>
                  <p className="text-sm text-green-600 mt-1">↑ 62% YoY</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">$89</p>
                  <p className="text-sm text-green-600 mt-1">↑ 12% YoY</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reports</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Q4 2024 Earnings Report</h3>
                    <span className="text-sm text-gray-500">Feb 15, 2025</span>
                  </div>
                  <p className="text-gray-600 mb-2">Full year results and Q4 performance analysis</p>
                  <button className="text-indigo-600 font-semibold hover:text-indigo-700">Download PDF →</button>
                </div>
                <div className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Annual Report 2024</h3>
                    <span className="text-sm text-gray-500">Jan 31, 2025</span>
                  </div>
                  <p className="text-gray-600 mb-2">Comprehensive annual report including financials and strategy</p>
                  <button className="text-indigo-600 font-semibold hover:text-indigo-700">Download PDF →</button>
                </div>
                <div className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Q3 2024 Earnings Report</h3>
                    <span className="text-sm text-gray-500">Nov 15, 2024</span>
                  </div>
                  <p className="text-gray-600 mb-2">Third quarter financial results and outlook</p>
                  <button className="text-indigo-600 font-semibold hover:text-indigo-700">Download PDF →</button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Governance</h2>
              <p className="text-gray-600 mb-4">
                We are committed to the highest standards of corporate governance and transparency. Our board of directors includes independent members with diverse expertise in retail, technology, and finance.
              </p>
              <div className="space-y-2">
                <button className="block text-indigo-600 font-semibold hover:text-indigo-700">Board of Directors →</button>
                <button className="block text-indigo-600 font-semibold hover:text-indigo-700">Corporate Governance Guidelines →</button>
                <button className="block text-indigo-600 font-semibold hover:text-indigo-700">Code of Ethics →</button>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Investor Contact</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-semibold text-gray-900">Email:</span><br />
                  investors@clothingbrand.com
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Phone:</span><br />
                  +1 (555) 123-4567
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Address:</span><br />
                  123 Fashion Avenue<br />
                  New York, NY 10001
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">May 15, 2025</p>
                  <p className="font-semibold text-gray-900">Q1 2025 Earnings Call</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">June 20, 2025</p>
                  <p className="font-semibold text-gray-900">Annual Shareholder Meeting</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">August 14, 2025</p>
                  <p className="font-semibold text-gray-900">Q2 2025 Earnings Call</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-indigo-50 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">Email Alerts</h2>
              <p className="text-gray-600 text-sm mb-4">
                Sign up to receive email alerts about financial results and events
              </p>
              <button className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investors;
