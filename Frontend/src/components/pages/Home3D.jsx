import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fetchProducts } from '../../store/slices/productSlice';

// 3D Components
import Hero3D from '../ui/Hero3D';
import ProductGrid3D from '../ui/ProductGrid3D';
import About3D from '../ui/About3D';
import Testimonials3D from '../ui/Testimonials3D';

import LoadingSpinner from '../ui/LoadingSpinner';

const Home3D = () => {
  const dispatch = useDispatch();
  const { products, featuredProducts, isLoading } = useSelector(state => state.products);
  const [newArrivals, setNewArrivals] = useState([]);

  // Animation refs
  const [storyRef, storyInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });

  // Mock products for development
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      category: 'Men',
      subcategory: 'Tops',
      onSale: true,
    },
    {
      id: 2,
      name: 'Casual Denim Jacket',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
      category: 'Men',
      subcategory: 'Outerwear',
    },
    {
      id: 3,
      name: 'Sport Running Shoes',
      price: 89.99,
      comparePrice: 119.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      category: 'Accessories',
      subcategory: null,
      onSale: true,
    },
    {
      id: 4,
      name: 'Elegant Summer Dress',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
      category: 'Women',
      subcategory: 'Dresses',
    },
    {
      id: 5,
      name: 'Designer Handbag',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
      category: 'Accessories',
      subcategory: null,
    },
    {
      id: 6,
      name: 'Classic Polo Shirt',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
      images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'],
      category: 'Men',
      subcategory: 'Tops',
    },
  ];

  useEffect(() => {
    // Fetch featured products and new arrivals
    dispatch(fetchProducts({ featured: true, limit: 12 }));
  }, [dispatch]);

  useEffect(() => {
    // Use mock products if API fails or returns empty
    const displayProducts = products.length > 0 ? products : mockProducts;
    if (Array.isArray(displayProducts) && displayProducts.length > 0) {
      setNewArrivals(displayProducts.slice(0, 4));
    }
  }, [products]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section with 3D Effects */}
      <Hero3D />

      {/* Featured Products Grid with 3D Animations */}
      <ProductGrid3D 
        products={featuredProducts} 
        title="Featured Collection"
        subtitle="Discover our most popular pieces that define contemporary style"
      />

      {/* New Arrivals Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/10" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 dark:from-white dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              New Arrivals
            </h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Fresh styles that push the boundaries of fashion. Each piece crafted with precision and designed for those who dare to be different.
            </p>
          </motion.div>

          <ProductGrid3D 
            products={newArrivals} 
            showTitle={false}
          />
        </div>
      </section>

      {/* Brand Story Section with 3D Effects */}
      <section ref={storyRef} className="py-20 lg:py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black" />
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, purple 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, blue 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, purple 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8 text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1 }}
            >
              <motion.h2 
                className="text-4xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Built for Those Who
                <motion.span 
                  className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={storyInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  Push Limits
                </motion.span>
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                APEX isn't just about clothing – it's about a mindset. We create premium apparel 
                for individuals who refuse to settle, who push boundaries, and who understand that 
                excellence is not a destination but a journey.
              </motion.p>
              
              <motion.p 
                className="text-gray-400 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Every piece in our collection is crafted with precision, designed for performance, 
                and built to last. From the gym to the streets, APEX moves with you.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link to="/about">
                  <motion.button
                    className="group relative px-8 py-4 border-2 border-purple-400 text-purple-400 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:text-white"
                    whileHover={{ 
                      scale: 1.05,
                      borderColor: "#ffffff",
                      color: "#ffffff"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Discover Our Story</span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50, rotateY: -15 }}
              animate={storyInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="relative transform-gpu"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Brand Story"
                  className="w-full h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 rounded-2xl" />
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 border-2 border-purple-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -180, -360],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with 3D Animations */}
      <section ref={statsRef} className="py-20 lg:py-32 relative overflow-hidden bg-black dark:bg-gray-950">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                 backgroundSize: "50px 50px"
               }} 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Millions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10M+", label: "Happy Customers", delay: 0.1 },
              { number: "50+", label: "Countries", delay: 0.2 },
              { number: "99%", label: "Satisfaction Rate", delay: 0.3 },
              { number: "24/7", label: "Support", delay: 0.4 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: stat.delay,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  scale: 1.1,
                  y: -10,
                }}
              >
                <motion.div 
                  className="relative"
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  style={{ perspective: "1000px" }}
                >
                  <div className="text-5xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                    {stat.number}
                  </div>
                </motion.div>
                <div className="text-gray-400 dark:text-gray-500 text-lg group-hover:text-white dark:group-hover:text-gray-200 transition-colors duration-300">
                  {stat.label}
                </div>
                
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.2 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* About Section with 3D Technology Showcase */}
      <About3D />

      {/* Testimonials with 3D Cards */}
      <Testimonials3D />


    </div>
  );
};

export default Home3D;
