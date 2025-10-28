import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineEye } from 'react-icons/hi';
import { toast } from 'react-toastify';

const ProductCard3D = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const handleAddToCart = (e) => {
    console.log('🛒 Add to Cart clicked!', product);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const productImage = product.image || product.images?.[0] || 'https://via.placeholder.com/400';
    const productPrice = product.salePrice || product.price;
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: productPrice,
      image: productImage,
      size: 'M', // Default size
      quantity: 1
    }));
    // Toast notification is shown by cartSlice reducer
  };

  const handleAddToWishlist = (e) => {
    console.log('❤️ Add to Wishlist clicked!', product);
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishlist(product));
    // Toast notification is shown by wishlistSlice reducer
  };

  const handleQuickView = (e) => {
    console.log('👁️ Quick View clicked!', product);
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    }
  };

  const imageVariants = {
    rest: { 
      scale: 1,
      rotateX: 0,
      rotateY: 0
    },
    hover: { 
      scale: 1.05,
      rotateX: mousePosition.y * 0.1,
      rotateY: mousePosition.x * 0.1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const actionButtonVariants = {
    rest: { scale: 0, opacity: 0 },
    hover: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 400,
        damping: 20
      }
    })
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group relative"
    >
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        whileHover={{ 
          y: -10,
          boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 5px 20px rgba(0,0,0,0.1)'
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <motion.div
            variants={imageVariants}
            animate={isHovered ? "hover" : "rest"}
            className="relative"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 sm:h-72 object-cover"
            />
            
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%', skewX: -20 }}
              whileHover={{ 
                x: '100%',
                transition: { duration: 0.8, ease: 'easeInOut' }
              }}
            />
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            variants={overlayVariants}
            animate={isHovered ? "hover" : "rest"}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
            style={{ zIndex: 10 }}
          >
            <div className="flex space-x-3 pointer-events-auto">
              {/* Quick View */}
              <motion.button
                custom={0}
                variants={actionButtonVariants}
                animate={isHovered ? "hover" : "rest"}
                onClick={handleQuickView}
                className="p-3 bg-white/90 dark:bg-gray-700/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors pointer-events-auto cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiOutlineEye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>

              {/* Add to Cart */}
              <motion.button
                custom={1}
                variants={actionButtonVariants}
                animate={isHovered ? "hover" : "rest"}
                onClick={handleAddToCart}
                className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors pointer-events-auto cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
              </motion.button>

              {/* Add to Wishlist */}
              <motion.button
                custom={2}
                variants={actionButtonVariants}
                animate={isHovered ? "hover" : "rest"}
                onClick={handleAddToWishlist}
                className="p-3 bg-white/90 dark:bg-gray-700/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors pointer-events-auto cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiOutlineHeart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>
          </motion.div>

          {/* Sale Badge */}
          {(product.salePrice || product.onSale || product.comparePrice) && (
            <motion.div
              className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              SALE
            </motion.div>
          )}

          {/* New Badge */}
          {product.isNew && (
            <motion.div
              className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              NEW
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <motion.div 
          className="p-6"
          style={{
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
            transformStyle: 'preserve-3d'
          }}
          transition={{ duration: 0.3 }}
        >
          <Link to={`/products/${product.id}`} className="block group">
            <motion.h3 
              className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-gray-200 transition-colors"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {product.name}
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2"
              style={{
                transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)'
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {product.description}
            </motion.p>
            
            <motion.div 
              className="flex items-center justify-between"
              style={{
                transform: isHovered ? 'translateZ(15px)' : 'translateZ(0px)'
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                {(product.salePrice || product.comparePrice) ? (
                  <>
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">
                      ${product.salePrice || product.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${product.comparePrice || product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <span
                      className={`text-sm ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Link>

          {/* Quick Add Button */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(e);
            }}
            className="w-full mt-4 bg-gray-100 hover:bg-black hover:text-white text-gray-900 py-3 rounded-lg font-medium transition-all duration-300 pointer-events-auto cursor-pointer relative z-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)'
            }}
          >
            Add to Cart
          </motion.button>
        </motion.div>

        {/* 3D Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          animate={{
            borderColor: isHovered ? 'rgba(0,0,0,0.1)' : 'transparent'
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: isHovered 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.05))'
              : 'transparent'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductCard3D;
