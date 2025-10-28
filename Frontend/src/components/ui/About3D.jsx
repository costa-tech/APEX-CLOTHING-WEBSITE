import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About3D = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const features = [
    {
      icon: "🎯",
      title: "Precision Crafted",
      description: "Every stitch, every seam designed with meticulous attention to detail."
    },
    {
      icon: "⚡",
      title: "Performance First",
      description: "Advanced materials that move with you and enhance your performance."
    },
    {
      icon: "🌍",
      title: "Sustainably Made",
      description: "Committed to environmental responsibility in every aspect of production."
    },
    {
      icon: "💎",
      title: "Premium Quality",
      description: "Only the finest materials make it into our collections."
    }
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 relative overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                 backgroundSize: "40px 40px"
               }} 
          />
        </div>
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-purple-500/30 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transform rotate-45"
          animate={{
            rotate: [45, 405],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-10 w-16 h-16 border-2 border-blue-500/30 transform rotate-45"
          animate={{
            rotate: [45, -315],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                The Science of
                <motion.span 
                  className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  Performance
                </motion.span>
              </h2>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-8"
                initial={{ width: 0 }}
                animate={inView ? { width: 96 } : {}}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </motion.div>

            <motion.p 
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              At APEX, we don't just make clothing – we engineer experiences. Our research and development team works tirelessly to create fabrics that breathe, flex, and perform under the most demanding conditions.
            </motion.p>

            <motion.p 
              className="text-gray-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              From moisture-wicking technology to antimicrobial treatments, every innovation serves a purpose: to help you push beyond your limits and achieve greatness.
            </motion.p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + (0.1 * index) }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-3xl mb-3"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h4 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="relative transform-gpu"
              whileHover={{ 
                rotateY: 10,
                rotateX: 5,
                scale: 1.02,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="APEX Technology"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 via-transparent to-blue-900/60" />
                
                {/* Floating tech elements */}
                <motion.div
                  className="absolute top-8 right-8 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-purple-400 text-sm font-mono">MOISTURE-WICK</div>
                  <div className="text-white text-xs">99.8% Efficiency</div>
                </motion.div>

                <motion.div
                  className="absolute bottom-8 left-8 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-blue-400 text-sm font-mono">BREATHABILITY</div>
                  <div className="text-white text-xs">Advanced Airflow</div>
                </motion.div>
              </div>

              {/* Orbiting elements */}
              <motion.div
                className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                className="absolute -bottom-6 -right-6 w-16 h-16 border-2 border-purple-400 rounded-full"
                animate={{
                  rotate: [0, -360],
                  scale: [1, 0.8, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Data visualization lines */}
              <motion.div
                className="absolute top-1/2 -right-8 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.h3 
            className="text-2xl lg:text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            Experience the Difference
          </motion.h3>
          <motion.p 
            className="text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.9 }}
          >
            Join the revolution of performance-driven apparel. Every thread, every fiber, engineered for excellence.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 2.1 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full overflow-hidden shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10">Shop Collection</span>
            </motion.button>
            
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
              <span className="relative z-10">Learn More</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About3D;
