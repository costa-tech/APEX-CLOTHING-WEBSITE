import { motion } from 'framer-motion';
import { TruckIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable shipping to get your order to you quickly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <TruckIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">On orders over $50</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <ClockIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">2-5 business days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <GlobeAltIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Worldwide</h3>
            <p className="text-gray-600">International shipping available</p>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Methods</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Shipping (FREE over $50)</h3>
                <p className="text-gray-600 mb-2">Delivery in 5-7 business days</p>
                <p className="text-gray-700 font-medium">$5.99 for orders under $50</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Shipping</h3>
                <p className="text-gray-600 mb-2">Delivery in 2-3 business days</p>
                <p className="text-gray-700 font-medium">$12.99</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Overnight Shipping</h3>
                <p className="text-gray-600 mb-2">Next business day delivery</p>
                <p className="text-gray-700 font-medium">$24.99</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">International Shipping</h3>
                <p className="text-gray-600 mb-2">Delivery in 7-14 business days</p>
                <p className="text-gray-700 font-medium">Calculated at checkout</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Processing</h2>
            <p className="text-gray-600 mb-4">
              Orders are processed Monday through Friday, excluding major holidays. Orders placed after 2 PM EST will be processed the next business day.
            </p>
            <p className="text-gray-600">
              You will receive a confirmation email with tracking information once your order has shipped.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">International Shipping</h2>
            <p className="text-gray-600 mb-4">
              We ship to over 100 countries worldwide. International shipping rates and delivery times vary by destination.
            </p>
            <p className="text-gray-600 mb-4">
              Please note that international orders may be subject to import duties and taxes, which are the responsibility of the recipient.
            </p>
            <p className="text-gray-600">
              For more information about international shipping to your country, please contact our customer service team.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
