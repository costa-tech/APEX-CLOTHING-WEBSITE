import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery, and overnight shipping is also available. Free shipping is offered on all orders over $50."
        },
        {
          q: "Do you ship internationally?",
          a: "Yes! We ship to over 100 countries worldwide. International shipping rates and delivery times vary by destination and are calculated at checkout."
        },
        {
          q: "How can I track my order?",
          a: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing your order history."
        },
        {
          q: "Can I change or cancel my order?",
          a: "Orders can be modified or cancelled within 1 hour of placement. After that, orders are processed and cannot be changed. Please contact customer service immediately if you need assistance."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer easy returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Visit our Returns page for complete details."
        },
        {
          q: "How do I return an item?",
          a: "Log in to your account, go to order history, select the item to return, and request a return. We'll email you a prepaid return label. Ship the item back and we'll process your refund within 5-7 business days."
        },
        {
          q: "Do you offer exchanges?",
          a: "Yes! Follow the return process and indicate you'd like an exchange. We'll ship your exchange item as soon as we receive your return."
        },
        {
          q: "How long does it take to receive a refund?",
          a: "Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method."
        }
      ]
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          q: "How do I find my size?",
          a: "Check our Size Guide page for detailed measurements. We provide sizing charts for both men's and women's clothing. If you're between sizes, we recommend sizing up."
        },
        {
          q: "Are your products true to size?",
          a: "Yes, our products generally run true to size. Each product page includes specific fit information and customer reviews that often mention sizing."
        },
        {
          q: "What materials are your clothes made from?",
          a: "We use high-quality materials including cotton, polyester blends, denim, and performance fabrics. Specific material information is listed on each product page."
        },
        {
          q: "How do I care for my clothing?",
          a: "Care instructions are included on the label of each garment. Generally, we recommend washing in cold water and hanging to dry for best results."
        }
      ]
    },
    {
      category: "Payment & Security",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes! We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers."
        },
        {
          q: "Do you offer gift cards?",
          a: "Yes, we offer digital gift cards in various denominations. They can be purchased on our website and are delivered via email."
        },
        {
          q: "Can I use multiple discount codes?",
          a: "Only one discount code can be applied per order. The system will automatically apply the code that gives you the best discount."
        }
      ]
    },
    {
      category: "Account & Rewards",
      questions: [
        {
          q: "Do I need an account to place an order?",
          a: "No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, and receive exclusive offers."
        },
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page and enter your email. We'll send you instructions to reset your password."
        },
        {
          q: "Do you have a loyalty program?",
          a: "Yes! Join our rewards program to earn points on every purchase, get birthday discounts, and receive early access to sales."
        },
        {
          q: "How do I update my account information?",
          a: "Log in to your account and go to 'Profile Settings' where you can update your email, password, shipping addresses, and payment methods."
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about orders, shipping, returns, and more
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div key={questionIndex} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full flex items-center justify-between text-left py-2 hover:text-indigo-600 transition-colors"
                      >
                        <span className="text-lg font-semibold text-gray-900 pr-4">{faq.q}</span>
                        <ChevronDownIcon 
                          className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-600 mt-2 pr-8">{faq.a}</p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-indigo-50 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our customer service team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
