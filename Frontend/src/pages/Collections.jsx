import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard3D from '../components/ui/ProductCard3D';
import ProductFilters from '../components/ui/ProductFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const Collections = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { category: categoryParam } = useParams();
  const { products = [], isLoading: loading } = useSelector((state) => state.products);

  // Get category from URL params or search params
  const category = categoryParam || searchParams.get('category');
  const search = searchParams.get('search');
  const sale = searchParams.get('sale');

  // Define subcategories for each main category
  const subcategoriesConfig = {
    Men: [
      { 
        name: 'Tops', 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        description: 'T-shirts, Shirts, Polos'
      },
      { 
        name: 'Bottoms', 
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
        description: 'Jeans, Pants, Shorts'
      },
      { 
        name: 'Outerwear', 
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
        description: 'Jackets, Coats, Hoodies'
      },
      { 
        name: 'Activewear', 
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
        description: 'Sports & Gym Wear'
      },
    ],
    Women: [
      { 
        name: 'Tops', 
        image: 'https://images.unsplash.com/photo-1564257577-2edd86b38e23?w=600',
        description: 'T-shirts, Blouses, Shirts'
      },
      { 
        name: 'Bottoms', 
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600',
        description: 'Jeans, Pants, Skirts'
      },
      { 
        name: 'Dresses', 
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
        description: 'Casual & Formal Dresses'
      },
      { 
        name: 'Outerwear', 
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600',
        description: 'Jackets, Coats, Cardigans'
      },
      { 
        name: 'Activewear', 
        image: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=600',
        description: 'Sports & Yoga Wear'
      },
    ],
  };

  // Check if current category should show subcategories
  const showSubcategories = (category === 'Men' || category === 'Women') && !search && !sale;

  // Mock products for development
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      category: category || 'Men',
      subcategory: 'Tops',
      onSale: true,
    },
    {
      id: 2,
      name: 'Casual Denim Jacket',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
      category: category || 'Men',
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

  // Use mock products if API fails or returns empty
  const displayProducts = products.length > 0 ? products : mockProducts;

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (sale) params.sale = sale;
    
    console.log('🔍 Fetching products with params:', params);
    dispatch(fetchProducts(params));
  }, [dispatch, category, search, sale]);

  // Log products when they change
  useEffect(() => {
    console.log('📦 Products from Redux:', products);
    console.log('📊 Display products:', displayProducts);
    if (displayProducts.length > 0) {
      console.log('🖼️ First product image data:', {
        image: displayProducts[0].image,
        images: displayProducts[0].images,
        name: displayProducts[0].name
      });
    }
  }, [products, displayProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Render subcategory cards for Men/Women
  if (showSubcategories) {
    const subcategories = subcategoriesConfig[category] || [];
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {category} Collection
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Browse by category</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/collections/${category}/${subcategory.name}`}>
                  <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
                    {/* Image */}
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={subcategory.image}
                        alt={subcategory.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold mb-1">{subcategory.name}</h3>
                      <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {subcategory.description}
                      </p>
                      <div className="mt-3 inline-flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                        Shop Now 
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {sale ? 'Sale Items' : category ? `${category} Collection` : 'All Collections'}
          </h1>
          {search && (
            <p className="text-gray-600 dark:text-gray-400">
              Search results for: <span className="font-semibold">{search}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {!displayProducts || displayProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                  <ProductCard3D key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
