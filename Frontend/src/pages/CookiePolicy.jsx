import { motion } from 'framer-motion';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: October 28, 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 space-y-6"
        >
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-600">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-600">
                  These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences (language, region) and choices you make.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve our website's performance and user experience.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                <p className="text-gray-600">
                  These cookies track your online activity to help advertisers deliver more relevant advertising or limit how many times you see an ad. They may be set by us or by third-party providers.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
            <p className="text-gray-600 mb-2">We use cookies to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Keep you signed in to your account</li>
              <li>Remember your shopping cart items</li>
              <li>Understand your preferences and improve your experience</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Deliver personalized content and advertisements</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              We may use third-party service providers who set cookies on our website to perform various functions:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Google Analytics:</strong> To analyze website usage and improve our services</li>
              <li><strong>Payment Processors:</strong> To securely process transactions</li>
              <li><strong>Social Media Platforms:</strong> To enable social sharing features</li>
              <li><strong>Advertising Networks:</strong> To deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              You have several options to manage or disable cookies:
            </p>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                <p className="text-gray-600">
                  Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. Please note that disabling cookies may affect your experience on our website.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Preference Center</h3>
                <p className="text-gray-600 mb-2">
                  You can manage your cookie preferences using our Cookie Preference Center:
                </p>
                <button className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors">
                  Manage Cookie Preferences
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Opt-Out Links</h3>
                <p className="text-gray-600">
                  You can opt out of certain third-party cookies:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                  <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Opt-out</a></li>
                  <li>Advertising cookies: <a href="http://www.aboutads.info/choices/" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Duration</h2>
            <p className="text-gray-600 mb-2">Cookies may be:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device until they expire or you delete them</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-600">
              We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. Please check this page periodically for updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: privacy@clothingbrand.com</p>
              <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-700">Address: 123 Fashion Avenue, New York, NY 10001</p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;
