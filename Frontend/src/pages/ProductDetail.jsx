import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../store/slices/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync } from '../store/slices/wishlistSlice';
import { fetchProductById, clearCurrentProduct } from '../store/slices/productSlice';
import { HiOutlineHeart, HiHeart, HiOutlineStar, HiStar, HiOutlineShare, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/ui/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { currentProduct, isProductLoading, error } = useSelector(state => state.products);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  // Fallback mock product data for development
  const mockProduct = {
    _id: id,
    name: 'Elite Performance Training Tee',
    price: 45.99,
    comparePrice: 59.99,
    description: 'Experience ultimate comfort and performance with our Elite Performance Training Tee. Crafted with premium moisture-wicking fabric, this tee keeps you dry and comfortable during your most intense workouts.',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', alt: 'Elite Performance Training Tee' },
      { url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', alt: 'Elite Performance Training Tee' },
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', alt: 'Elite Performance Training Tee' },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f37f4062?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', alt: 'Elite Performance Training Tee' }
    ],
    rating: { average: 4.8, count: 234 },
    isNew: true,
    onSale: true,
    sizes: [{ size: 'XS' }, { size: 'S' }, { size: 'M' }, { size: 'L' }, { size: 'XL' }, { size: 'XXL' }],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Navy', value: '#1E3A8A' },
      { name: 'Grey', value: '#6B7280' }
    ],
    category: 'Men',
    features: [
      'Moisture-wicking fabric technology',
      'Quick-dry material',
      'Anti-odor treatment',
      'Flatlock seam construction',
      'UPF 50+ sun protection'
    ],
    specifications: {
      'Material': '88% Polyester, 12% Elastane',
      'Fit': 'Slim Fit',
      'Care': 'Machine wash cold, tumble dry low',
      'Weight': '120gsm',
      'Origin': 'Made in Portugal'
    }
  };

  // Use current product from store or fallback to mock data
  const productData = currentProduct?.product || currentProduct || mockProduct;

  // Normalize the product data to handle both backend format and mock format
  const product = {
    id: productData._id || productData.id,
    name: productData.name,
    price: productData.price,
    originalPrice: productData.comparePrice || productData.originalPrice,
    description: productData.description,
    images: Array.isArray(productData.images) 
      ? productData.images.map(img => typeof img === 'string' ? img : img.url || img)
      : [productData.images],
    rating: typeof productData.rating === 'object' ? productData.rating.average : productData.rating || 4.5,
    reviews: typeof productData.rating === 'object' ? productData.rating.count : productData.reviews || 0,
    isNew: productData.isNew || false,
    onSale: productData.onSale || (productData.comparePrice && productData.comparePrice > productData.price),
    sizes: Array.isArray(productData.sizes) 
      ? productData.sizes.map(size => typeof size === 'string' ? size : size.size)
      : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: Array.isArray(productData.colors) 
      ? productData.colors.map(color => typeof color === 'object' && color.name ? color : { name: color, value: color })
      : [{ name: 'Black', value: '#000000' }, { name: 'White', value: '#FFFFFF' }],
    category: productData.category || 'General',
    features: productData.features || [
      'High-quality materials',
      'Comfortable fit',
      'Durable construction'
    ],
    specifications: productData.specifications || {
      'Material': 'Premium fabric',
      'Care': 'Machine wash cold',
      'Origin': 'Quality manufacturing'
    }
  };

  // Mock related products
  const relatedProducts = [
    {
      id: 2,
      name: 'Training Shorts Pro',
      price: 39.99,
      originalPrice: 49.99,
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.6,
      reviews: 156,
      isNew: false,
      onSale: true
    },
    {
      id: 3,
      name: 'Performance Hoodie',
      price: 79.99,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.9,
      reviews: 89,
      isNew: true,
      onSale: false
    }
  ];
  useEffect(() => {
    // Clear current product and fetch new one
    dispatch(clearCurrentProduct());
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Set default color when product data is available
    if (product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product.colors, selectedColor]);

  // Handle loading and error states
  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading product..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    dispatch(addToCartAsync({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    }));
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    const isWishlisted = wishlistItems.some(item => 
      item.product?.id === product.id || 
      item.product?._id === product.id ||
      item.id === product.id
    );
    
    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(product.id));
    } else {
      dispatch(addToWishlistAsync(product.id));
    }
  };

  const isWishlisted = wishlistItems.some(item => 
    item.product?.id === product.id || 
    item.product?._id === product.id ||
    item.id === product.id
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<HiStar key={i} className="w-4 h-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<HiStar key="half" className="w-4 h-4 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<HiOutlineStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-gray-700">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate('/products')} className="hover:text-gray-700">
                Products
              </button>
            </li>            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-center object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-center object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isNew && (
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    NEW
                  </span>
                )}
                {product.onSale && (
                  <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                    SALE
                  </span>                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.onSale && (
                <span className="text-sm font-medium text-red-600">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Color: <span className="font-normal">{selectedColor}</span>
              </h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-black ring-2 ring-black ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Add to Cart
              </button>
              
              <div className="flex space-x-3">                <button
                  onClick={handleWishlist}
                  className="flex-1 flex items-center justify-center py-3 px-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {isWishlisted ? (
                    <HiHeart className="w-5 h-5 text-red-500 mr-2" />
                  ) : (
                    <HiOutlineHeart className="w-5 h-5 mr-2" />
                  )}
                  Wishlist
                </button>
                
                <button className="flex-1 flex items-center justify-center py-3 px-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <HiOutlineShare className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <HiOutlineTruck className="w-5 h-5 mr-2" />
                Free shipping on orders over $75
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <HiOutlineRefresh className="w-5 h-5 mr-2" />
                Free returns within 30 days
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <HiOutlineShieldCheck className="w-5 h-5 mr-2" />
                2-year warranty included
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'features', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-black rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-2">
                      <dt className="text-sm font-medium text-gray-900">{key}</dt>
                      <dd className="text-sm text-gray-600">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
                <div className="text-center py-8 text-gray-500">
                  <p>Reviews feature coming soon!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
