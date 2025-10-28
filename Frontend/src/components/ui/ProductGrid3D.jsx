import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard3D from './ProductCard3D';

const ProductGrid3D = ({ products: propProducts = [], title = "FEATURED COLLECTION", subtitle = "Discover our carefully curated selection of premium pieces, each designed to elevate your everyday style.", showTitle = true }) => {
  const [products, setProducts] = useState([]);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    // Use prop products if provided, otherwise use mock data
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
    } else {
      // Mock product data as fallback
      setProducts([
      {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        description: 'Soft, breathable cotton tee perfect for everyday wear',
        price: 29.99,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
        rating: 4.8,
        isNew: true
      },
      {
        id: 2,
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket with modern fit and premium quality',
        price: 89.99,
        salePrice: 69.99,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center',
        rating: 4.6,
        isNew: false
      },
      {
        id: 3,
        name: 'Wool Blend Sweater',
        description: 'Cozy wool blend sweater for cool weather comfort',
        price: 79.99,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop&crop=center',
        rating: 4.7,
        isNew: false
      },
      {
        id: 4,
        name: 'Athletic Performance Shorts',
        description: 'Moisture-wicking shorts designed for active lifestyle',
        price: 39.99,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
        rating: 4.9,
        isNew: true
      },
      {
        id: 5,
        name: 'Leather Crossbody Bag',
        description: 'Genuine leather bag with adjustable strap and multiple compartments',
        price: 129.99,
        salePrice: 99.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
        rating: 4.5,
        isNew: false
      },
      {
        id: 6,
        name: 'Minimalist Sneakers',
        description: 'Clean, modern sneakers crafted with sustainable materials',
        price: 119.99,
        salePrice: null,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
        rating: 4.8,
        isNew: true
      }
    ]);
    }
  }, [propProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
          className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-2xl opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        {showTitle && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.div
            variants={headerVariants}
            className="space-y-6"
          >
            <motion.h2 
              className="text-4xl lg:text-6xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #000000 0%, #434343 50%, #000000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {title}
            </motion.h2>
            
            <motion.p
              variants={headerVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Animated Underline */}
            <motion.div
              className="w-24 h-1 bg-black mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>
        </motion.div>
        )}

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {products.map((product, index) => (
            <ProductCard3D 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16 lg:mt-24"
        >
          <motion.button
            className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
            }}
          >
            View All Products
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gray-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default ProductGrid3D;
