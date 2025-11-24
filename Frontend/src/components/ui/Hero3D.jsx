import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const Hero3D = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Smooth springs
  const springY1 = useSpring(y1, { stiffness: 300, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 200, damping: 25 });
  const springY3 = useSpring(y3, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20"
      style={{ opacity, scale }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <motion.div
          style={{ y: springY1, x: mousePosition.x * 0.5 }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-black/5 to-gray-300/10 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          style={{ y: springY2, x: mousePosition.x * -0.3 }}
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-gray-400/10 to-black/5 rounded-lg rotate-45 blur-lg"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          style={{ y: springY3, x: mousePosition.x * 0.7 }}
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-gray-200/20 to-gray-400/10 rounded-full blur-2xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />

        {/* Grid Pattern */}
        <motion.div
          style={{ y: springY1 }}
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        >
          <div className="grid grid-cols-12 h-full gap-4 p-8">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-300/50 rounded-sm"
                style={{
                  animationDelay: `${i * 0.01}s`,
                  animation: 'fadeInGrid 3s ease-out forwards'
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="space-y-8"
              style={{ y: springY3 }}
            >
              <motion.div
                variants={itemVariants}
                className="space-y-6"
              >
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold leading-tight"
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
                  REDEFINE
                  <br />
                  <span className="block">YOUR STYLE</span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  Discover premium fashion that speaks to your individuality. 
                  Every piece crafted for the modern lifestyle.
                </motion.p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}
                  >
                    Shop Collection
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold rounded-full border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                {[
                  { number: '1000+', label: 'Products' },
                  { number: '50K+', label: 'Customers' },
                  { number: '99%', label: 'Satisfaction' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-2xl lg:text-3xl font-bold text-black dark:text-white">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - 3D Visual */}
            <motion.div
              style={{ y: springY2, x: mousePosition.x * 0.1 }}
              className="relative h-96 lg:h-[600px]"
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {/* 3D Product Showcase */}
              <div className="relative w-full h-full">
                {/* Main Product Image */}
                <motion.div
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 5px 20px rgba(0,0,0,0.1)'
                  }}
                  whileHover={{ 
                    rotateY: 5,
                    rotateX: 2,
                    scale: 1.02
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center"
                    alt="Featured Product"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </motion.div>



                <motion.div
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-xl flex items-center justify-center font-bold"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  NEW
                </motion.div>

                {/* Price Tag */}
                <motion.div
                  className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <span className="text-lg font-bold text-black dark:text-white">$89</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gray-600 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes fadeInGrid {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </motion.section>
  );
};

export default Hero3D;
