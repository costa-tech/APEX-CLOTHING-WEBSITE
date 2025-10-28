import { motion } from 'framer-motion';

const Press = () => {
  const pressReleases = [
    {
      date: "March 15, 2025",
      title: "Clothing Brand Launches Sustainable Collection",
      excerpt: "New eco-friendly line features 100% recycled materials and carbon-neutral shipping."
    },
    {
      date: "February 1, 2025",
      title: "Clothing Brand Expands to European Markets",
      excerpt: "Company announces expansion into UK, France, and Germany with new distribution centers."
    },
    {
      date: "January 10, 2025",
      title: "Annual Report Shows Record Growth",
      excerpt: "2024 revenue up 45% as company continues rapid expansion in online retail."
    }
  ];

  const mediaKit = [
    { name: "Company Logo (PNG)", size: "2.4 MB" },
    { name: "Company Logo (SVG)", size: "156 KB" },
    { name: "Brand Guidelines", size: "8.1 MB" },
    { name: "Product Images", size: "45 MB" },
    { name: "Executive Photos", size: "12 MB" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Latest news, press releases, and media resources
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <p className="text-sm text-gray-500 mb-2">{release.date}</p>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                    <p className="text-gray-600 mb-4">{release.excerpt}</p>
                    <button className="text-indigo-600 font-semibold hover:text-indigo-700">
                      Read More →
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Media Contact</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-semibold text-gray-900">Email:</span><br />
                  press@clothingbrand.com
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Phone:</span><br />
                  +1 (555) 123-4567
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Hours:</span><br />
                  Monday - Friday<br />
                  9:00 AM - 6:00 PM EST
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Media Kit</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Download our brand assets, logos, and product images
              </p>
              <div className="space-y-2">
                {mediaKit.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.size}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors">
                Download All
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
