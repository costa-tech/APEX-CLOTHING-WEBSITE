import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in">
          Reach Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            APEX
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto text-gray-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Premium athletic wear designed for those who refuse to settle. 
          Elevate your performance, elevate your style.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link
            to="/products"
            className="group bg-white text-black px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 flex items-center space-x-2"
          >
            <span>Shop Now</span>
            <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <Link
            to="/collections"
            className="group border-2 border-white text-white px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
          >
            View Collections
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
