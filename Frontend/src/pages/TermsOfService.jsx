import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: October 28, 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 space-y-6"
        >
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-gray-600 mb-2">This license shall automatically terminate if you violate any of these restrictions:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Terms</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You must be 13 years or older to use this service</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You may not use our service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Products and Pricing</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>We reserve the right to modify or discontinue products without notice</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities of products</li>
              <li>Product descriptions and images are as accurate as possible but may contain errors</li>
              <li>We do not guarantee that product colors will be accurate on all screens</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Orders and Payment</h2>
            <p className="text-gray-600 mb-2">By placing an order, you:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Agree to provide current, complete, and accurate purchase information</li>
              <li>Agree to promptly update account information</li>
              <li>Authorize us to charge your payment method for the total amount</li>
            </ul>
            <p className="text-gray-600">
              We reserve the right to refuse or cancel any order for any reason including product availability, errors in pricing, or suspected fraud.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
            <p className="text-gray-600 mb-2">
              We ship to addresses provided by you. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Providing accurate shipping information</li>
              <li>Any additional customs fees for international orders</li>
              <li>Choosing appropriate shipping methods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Refunds</h2>
            <p className="text-gray-600">
              Our return and refund policy is detailed on our Returns page. By making a purchase, you agree to our return policy terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of Clothing Brand and protected by copyright and trademark laws.
            </p>
            <p className="text-gray-600">
              You may not reproduce, distribute, modify, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimer</h2>
            <p className="text-gray-600">
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600">
              In no event shall Clothing Brand or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website, even if we have been notified of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600">
              These terms and conditions are governed by and construed in accordance with the laws of the State of New York, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to revise these terms at any time. By continuing to use this website, you agree to be bound by the current version of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-600 mb-2">
              Questions about the Terms of Service should be sent to:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: legal@clothingbrand.com</p>
              <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-700">Address: 123 Fashion Avenue, New York, NY 10001</p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
