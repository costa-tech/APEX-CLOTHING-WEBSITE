import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineTruck, HiOutlineMail, HiOutlineDownload, HiOutlineHome } from 'react-icons/hi';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data from navigation state
  const { orderNumber, total, items, paymentMethod } = location.state || {
    orderNumber: 'ORD-123456789',
    total: 0,
    items: [],
    paymentMethod: 'cod'
  };

  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order #{orderNumber}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Order details not available</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            {/* Payment Instructions */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <HiOutlineMail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">⚠️ Complete Your Payment</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Please transfer <strong className="text-blue-600 text-lg">Rs. {total.toFixed(2)}</strong> to the following bank account:
                    </p>
                    <div className="bg-white rounded-md p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-medium text-gray-900">Commercial Bank of Ceylon</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-medium text-gray-900">Clothing Brand (Pvt) Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium text-gray-900 font-mono">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium text-blue-600 font-mono">{orderNumber}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      <strong>Important:</strong> Please use your order number <strong>{orderNumber}</strong> as the payment reference. 
                      Your order will be processed within 24 hours after payment confirmation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">✅ Cash on Delivery Selected</h3>
                    <p className="text-sm text-gray-700">
                      You'll pay <strong className="text-green-600 text-lg">Rs. {total.toFixed(2)}</strong> in cash when your order is delivered.
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Please keep exact change ready for smooth delivery.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Email */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <HiOutlineMail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Confirmation Email Sent</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We've sent a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <HiOutlineTruck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Estimated Delivery</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your order will be delivered by {estimatedDelivery.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>

            {/* Download Receipt */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors">
                <div className="flex-shrink-0">
                  <HiOutlineDownload className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Download Receipt</h3>
                  <p className="text-sm text-gray-600">
                    Get a PDF copy of your order receipt for your records.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/profile')}
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-gray-700 px-8 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <HiOutlineHome className="w-5 h-5 mr-1" />
            Back to Home
          </button>
        </div>

        {/* Order Summary Card */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-black rounded-lg p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Free Returns</h3>
              <p className="text-gray-300 text-sm">
                30-day return policy on all items
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Support</h3>
              <p className="text-gray-300 text-sm">
                24/7 support for any questions
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-300 text-sm">
                Premium quality or your money back
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Get notified about new arrivals, exclusive deals, and special offers.
          </p>
          <div className="max-w-md mx-auto flex space-x-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
