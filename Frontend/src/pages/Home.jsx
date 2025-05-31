import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import Hero from '../components/ui/Hero';
import CategoryGrid from '../components/ui/CategoryGrid';
import FeaturedCollection from '../components/ui/FeaturedCollection';
import Newsletter from '../components/ui/Newsletter';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const dispatch = useDispatch();
  const { products, featuredProducts, isLoading } = useSelector(state => state.products);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    // Fetch featured products and new arrivals
    dispatch(fetchProducts({ featured: true, limit: 8 }));
  }, [dispatch]);

  useEffect(() => {
    // Mock new arrivals data - replace with actual API call
    setNewArrivals(products.slice(0, 4));
  }, [products]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <Hero />

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Featured Collection */}
      <FeaturedCollection products={featuredProducts} />

      {/* New Arrivals */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">New Arrivals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest additions to our collection. Fresh styles that define the future of fashion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Built for Those Who
                <span className="gradient-text"> Push Limits</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                APEX isn't just about clothing – it's about a mindset. We create premium apparel 
                for individuals who refuse to settle, who push boundaries, and who understand that 
                excellence is not a destination but a journey.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every piece in our collection is crafted with precision, designed for performance, 
                and built to last. From the gym to the streets, APEX moves with you.
              </p>
              <Link to="/about" className="btn-secondary inline-block">
                Our Story
              </Link>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Brand Story"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">10M+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-300">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">99%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
