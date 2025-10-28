import { motion } from 'framer-motion';

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Size Guide</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive sizing charts
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Men's Sizing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Men's Sizing</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chest (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">XS</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">32-34</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26-28</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">32-34</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">S</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">34-36</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28-30</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">34-36</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">M</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38-40</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">32-34</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38-40</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">L</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42-44</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">36-38</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42-44</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">XL</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">46-48</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">40-42</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">46-48</td></tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Women's Sizing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Women's Sizing</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bust (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist (inches)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">XS</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30-32</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23-25</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">33-35</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">S</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">32-34</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25-27</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">35-37</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">M</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">34-36</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">27-29</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">37-39</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">L</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">36-38</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">29-31</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">39-41</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">XL</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38-40</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">31-33</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">41-43</td></tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* How to Measure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Chest/Bust</h3>
                <p className="text-gray-600">Measure around the fullest part of your chest/bust, keeping the tape parallel to the floor.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Waist</h3>
                <p className="text-gray-600">Measure around your natural waistline, keeping the tape comfortably loose.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hip</h3>
                <p className="text-gray-600">Measure around the fullest part of your hips, approximately 8 inches below your waist.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
