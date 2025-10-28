import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard3D from '../components/ui/ProductCard3D';
import ProductFilters from '../components/ui/ProductFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Collections = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { category: categoryParam } = useParams();
  const { products = [], isLoading: loading } = useSelector((state) => state.products);

  // Get category from URL params or search params
  const category = categoryParam || searchParams.get('category');
  const search = searchParams.get('search');
  const sale = searchParams.get('sale');

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
      onSale: true,
    },
    {
      id: 2,
      name: 'Casual Denim Jacket',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
      category: category || 'Men',
    },
    {
      id: 3,
      name: 'Sport Running Shoes',
      price: 89.99,
      comparePrice: 119.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      category: 'Accessories',
      onSale: true,
    },
    {
      id: 4,
      name: 'Elegant Summer Dress',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
      category: 'Women',
    },
    {
      id: 5,
      name: 'Designer Handbag',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
      category: 'Accessories',
    },
    {
      id: 6,
      name: 'Classic Polo Shirt',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
      images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'],
      category: 'Men',
    },
  ];

  // Use mock products if API fails or returns empty
  const displayProducts = products.length > 0 ? products : mockProducts;

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (sale) params.sale = sale;
    dispatch(fetchProducts(params));
  }, [dispatch, category, search, sale]);

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {sale ? 'Sale Items' : category ? `${category} Collection` : 'All Collections'}
          </h1>
          {search && (
            <p className="text-gray-600">
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
                <p className="text-gray-500 text-lg">No products found</p>
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
