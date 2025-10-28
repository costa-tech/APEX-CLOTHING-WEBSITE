import { motion } from 'framer-motion';
import { ArrowPathIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const Returns = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Not satisfied? We offer easy returns and exchanges within 30 days
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <ArrowPathIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">30-Day Returns</h3>
            <p className="text-gray-600">Easy returns within 30 days of purchase</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <ShieldCheckIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">We stand behind our products</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <CreditCardIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Refunds</h3>
            <p className="text-gray-600">Refunds processed within 5-7 business days</p>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Policy</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery for a full refund or exchange.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Eligibility</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
                <li>Items must be returned within 30 days of delivery</li>
                <li>Original packaging should be included when possible</li>
                <li>Proof of purchase (receipt or order confirmation) is required</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Non-Returnable Items</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Underwear and swimwear (for hygiene reasons)</li>
                <li>Personalized or customized items</li>
                <li>Sale items marked as "Final Sale"</li>
                <li>Gift cards</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Initiate Your Return</h3>
                  <p className="text-gray-600">Log in to your account and go to your order history. Select the item you wish to return and click "Request Return".</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Print Return Label</h3>
                  <p className="text-gray-600">We'll email you a prepaid return shipping label. Print it and attach it to your package.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Ship Your Return</h3>
                  <p className="text-gray-600">Drop off your package at any authorized shipping location. Keep your tracking number for reference.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Receive Your Refund</h3>
                  <p className="text-gray-600">Once we receive your return, we'll process your refund within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchanges</h2>
            <p className="text-gray-600 mb-4">
              Need a different size or color? We make exchanges easy! Follow the same return process and indicate that you'd like an exchange in your return request.
            </p>
            <p className="text-gray-600">
              We'll ship your exchange item as soon as we receive your return. If there's a price difference, we'll either refund or charge the difference accordingly.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
