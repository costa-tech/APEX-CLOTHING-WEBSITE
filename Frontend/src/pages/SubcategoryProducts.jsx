import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard3D from '../components/ui/ProductCard3D';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const SubcategoryProducts = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products = [], isLoading: loading } = useSelector((state) => state.products);

  // Mock products for each subcategory
  const mockProductsBySubcategory = {
    // MEN
    'Tops': [
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
        id: 6,
        name: 'Classic Polo Shirt',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'],
        category: 'Men',
        subcategory: 'Tops',
      },
    ],
    'Bottoms': [
      {
        id: 9,
        name: 'Slim Fit Jeans',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
        category: 'Men',
        subcategory: 'Bottoms',
      },
    ],
    'Outerwear': [
      {
        id: 2,
        name: 'Casual Denim Jacket',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
        category: 'Men',
        subcategory: 'Outerwear',
      },
    ],
    'Activewear': [
      {
        id: 10,
        name: 'Performance Training Shorts',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
        category: 'Men',
        subcategory: 'Activewear',
      },
    ],
    // WOMEN
    'Dresses': [
      {
        id: 4,
        name: 'Elegant Summer Dress',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
        category: 'Women',
        subcategory: 'Dresses',
      },
    ],
    'Tops-Women': [
      {
        id: 11,
        name: 'Casual Blouse',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1564257577-1dba5c2b63c2?w=400',
        images: ['https://images.unsplash.com/photo-1564257577-1dba5c2b63c2?w=400'],
        category: 'Women',
        subcategory: 'Tops',
      },
    ],
    'Bottoms-Women': [
      {
        id: 12,
        name: 'High-Waist Trousers',
        price: 54.99,
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
        images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'],
        category: 'Women',
        subcategory: 'Bottoms',
      },
    ],
    'Activewear-Women': [
      {
        id: 7,
        name: 'Yoga Leggings',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
        images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'],
        category: 'Women',
        subcategory: 'Activewear',
      },
    ],
  };

  // Get products for current subcategory
  const getSubcategoryKey = () => {
    if (category === 'Women' && (subcategory === 'Tops' || subcategory === 'Bottoms' || subcategory === 'Activewear')) {
      return `${subcategory}-Women`;
    }
    return subcategory;
  };

  const subcategoryKey = getSubcategoryKey();
  const mockProducts = mockProductsBySubcategory[subcategoryKey] || [];
  
  // Filter products from backend or use mock - ensure products is an array
  const productsArray = Array.isArray(products) ? products : [];
  const filteredProducts = productsArray.filter(
    (p) => p.category === category && p.subcategory === subcategory
  );
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : mockProducts;

  useEffect(() => {
    const params = { category, subcategory };
    dispatch(fetchProducts(params));
  }, [dispatch, category, subcategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button & Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/collections/${category}`)}
            className="flex items-center text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Back to {category}
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            {category} - {subcategory}
          </h1>
          <p className="text-gray-600 mt-2">
            {displayProducts.length} products found
          </p>
        </div>

        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this subcategory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryProducts;
