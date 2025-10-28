import { motion } from 'framer-motion';

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
          <p className="text-gray-600">Last updated: October 28, 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 space-y-6"
        >
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600">
              Clothing Brand is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all of our users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conformance Status</h2>
            <p className="text-gray-600 mb-4">
              The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. We strive to conform to WCAG 2.1 Level AA standards.
            </p>
            <p className="text-gray-600">
              Our website has been designed to be accessible to the widest possible audience, regardless of technology or ability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
            <p className="text-gray-600 mb-4">Our website includes the following accessibility features:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Keyboard Navigation:</strong> Full keyboard accessibility for users who cannot use a mouse</li>
              <li><strong>Screen Reader Compatibility:</strong> Proper HTML markup and ARIA labels for screen reader users</li>
              <li><strong>Text Alternatives:</strong> Alt text for images and transcripts for audio content</li>
              <li><strong>Clear Navigation:</strong> Consistent navigation structure throughout the site</li>
              <li><strong>Color Contrast:</strong> Sufficient color contrast ratios for text and interactive elements</li>
              <li><strong>Resizable Text:</strong> Text can be resized up to 200% without loss of functionality</li>
              <li><strong>Focus Indicators:</strong> Clear visual indicators for keyboard focus</li>
              <li><strong>Form Labels:</strong> Properly labeled form fields and error messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assistive Technologies</h2>
            <p className="text-gray-600 mb-2">
              Our website is compatible with the following assistive technologies:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Alternative input devices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Known Limitations</h2>
            <p className="text-gray-600 mb-4">
              Despite our best efforts, some content may not yet be fully accessible. We are working to address the following known issues:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Some third-party embedded content may not be fully accessible</li>
              <li>Certain legacy PDF documents may not meet current accessibility standards</li>
              <li>Some images from user-generated content may lack alternative text</li>
            </ul>
            <p className="text-gray-600 mt-4">
              We are actively working to remediate these issues and welcome your feedback to help us improve.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Compatibility</h2>
            <p className="text-gray-600 mb-2">
              Our website is designed to work with the following browsers:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Google Chrome (latest version)</li>
              <li>Mozilla Firefox (latest version)</li>
              <li>Apple Safari (latest version)</li>
              <li>Microsoft Edge (latest version)</li>
            </ul>
            <p className="text-gray-600 mt-4">
              For the best experience, we recommend using the latest version of your preferred browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Assistance</h2>
            <p className="text-gray-600 mb-4">
              We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please let us know:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> accessibility@clothingbrand.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p className="text-gray-700"><strong>Mail:</strong> 123 Fashion Avenue, New York, NY 10001</p>
            </div>
            <p className="text-gray-600 mt-4">
              We aim to respond to accessibility feedback within 5 business days and to propose a solution within 10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alternative Shopping Options</h2>
            <p className="text-gray-600 mb-2">
              If you experience difficulty using our website, we offer alternative ways to shop:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Call our customer service team: +1 (555) 123-4567</li>
              <li>Visit one of our physical retail locations</li>
              <li>Email us your order: orders@clothingbrand.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Efforts</h2>
            <p className="text-gray-600">
              We are committed to maintaining and improving the accessibility of our website. Our efforts include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
              <li>Regular accessibility audits and testing</li>
              <li>Training for staff on accessibility best practices</li>
              <li>Incorporating accessibility into our development process</li>
              <li>Working with accessibility consultants and users with disabilities</li>
              <li>Staying up-to-date with accessibility standards and guidelines</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Formal Complaints</h2>
            <p className="text-gray-600">
              If you are not satisfied with our response to your accessibility concern, you may file a formal complaint with the appropriate regulatory authority in your jurisdiction.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Accessibility;
