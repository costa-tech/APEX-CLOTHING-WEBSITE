import { motion } from 'framer-motion';
import { GlobeAltIcon, HeartIcon, SparklesIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sustainability</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our commitment to creating fashion that's better for people and the planet
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <CheckBadgeIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Eco Materials</h3>
            <p className="text-gray-600">70% of our products use sustainable materials</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <GlobeAltIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Carbon Neutral</h3>
            <p className="text-gray-600">100% carbon-neutral shipping</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <HeartIcon className="h-12 w-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fair Trade</h3>
            <p className="text-gray-600">Ethical labor practices across our supply chain</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <SparklesIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Zero Waste</h3>
            <p className="text-gray-600">Goal to achieve zero waste by 2030</p>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Sustainable Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Organic Cotton</h3>
                <p className="text-gray-600">Grown without harmful pesticides or synthetic fertilizers, using 91% less water than conventional cotton.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recycled Polyester</h3>
                <p className="text-gray-600">Made from post-consumer plastic bottles, reducing waste and carbon emissions by up to 75%.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tencel™ Lyocell</h3>
                <p className="text-gray-600">Biodegradable fiber made from sustainably harvested wood pulp in a closed-loop process.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hemp Fiber</h3>
                <p className="text-gray-600">Fast-growing crop that requires minimal water and no pesticides, naturally regenerating soil.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Supply Chain Transparency</h2>
            <p className="text-gray-600 mb-4">
              We believe in full transparency. Every product on our site includes information about where it was made, the materials used, and the environmental impact of its production.
            </p>
            <p className="text-gray-600 mb-4">
              Our factories are regularly audited to ensure fair wages, safe working conditions, and compliance with environmental regulations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-800">100%</p>
                <p className="text-sm text-green-700">Factory Compliance Rate</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-800">15+</p>
                <p className="text-sm text-blue-700">Years Average Worker Tenure</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-800">50%</p>
                <p className="text-sm text-purple-700">Female Leadership</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitments</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900">2025: 80% Sustainable Materials</h3>
                  <p className="text-gray-600">Increase sustainable material usage to 80% across all products.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900">2027: Circular Fashion Program</h3>
                  <p className="text-gray-600">Launch a take-back program to recycle old clothing into new products.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900">2030: Zero Waste Operations</h3>
                  <p className="text-gray-600">Eliminate all waste from our operations through recycling and composting.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900">2030: Net Positive Impact</h3>
                  <p className="text-gray-600">Give back more to the environment than we take through regenerative practices.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
