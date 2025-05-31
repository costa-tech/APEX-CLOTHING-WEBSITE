import React, { useState } from 'react';
import { HiOutlineMail } from 'react-icons/hi';
import { toast } from 'react-toastify';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6">
            <HiOutlineMail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stay Ahead of the Game
          </h2>
          
          <p className="text-lg text-gray-300 mb-8">
            Be the first to know about new drops, exclusive sales, and insider access to limited collections. 
            Join thousands of athletes who never miss a beat.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-white text-black rounded-md font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="loading-dots">Subscribing</span>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>
          
          <p className="text-sm text-gray-400 mt-4">
            No spam, just the good stuff. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
