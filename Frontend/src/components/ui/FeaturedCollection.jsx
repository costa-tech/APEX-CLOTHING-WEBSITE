import React from 'react';
import ProductCard3D from './ProductCard3D';

const FeaturedCollection = ({ products = [] }) => {
  // Mock featured products if none provided
  const mockProducts = [
    {
      id: 1,
      name: 'Elite Performance Tee',
      price: 45.99,
      originalPrice: 59.99,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.8,
      reviews: 234,
      isNew: true,
      onSale: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy']
    },
    {
      id: 2,
      name: 'Training Shorts Pro',
      price: 39.99,
      originalPrice: 49.99,
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.6,
      reviews: 156,
      isNew: false,
      onSale: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Gray', 'Blue']
    },
    {
      id: 3,
      name: 'Premium Hoodie',
      price: 89.99,
      originalPrice: 119.99,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.9,
      reviews: 342,
      isNew: true,
      onSale: false,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Gray', 'Navy']
    },
    {
      id: 4,
      name: 'Athletic Leggings',
      price: 65.99,
      images: ['https://images.unsplash.com/photo-1506629905607-d9a42596dd2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.7,
      reviews: 89,
      isNew: false,
      onSale: false,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black', 'Navy', 'Burgundy']
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handpicked essentials that represent the pinnacle of style and performance. 
            Each piece is crafted to elevate your everyday.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product) => (
            <ProductCard3D key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
