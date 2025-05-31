import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HiOutlineShoppingBag, 
  HiOutlineUser, 
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX
} from 'react-icons/hi';
import { logout } from '../../store/slices/authSlice';
import { toggleCart } from '../../store/slices/cartSlice';
import { searchProducts, setSearchQuery } from '../../store/slices/productSlice';
import MobileCart from './MobileCart';
import GlobalSearch from '../ui/GlobalSearch';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { totalQuantity, isOpen: isCartOpen } = useSelector(state => state.cart);
  const { searchQuery } = useSelector(state => state.products);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm));
      dispatch(searchProducts(searchTerm));
      navigate('/products');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/products?category=Men' },
    { name: 'Women', path: '/products?category=Women' },
    { name: 'Accessories', path: '/products?category=Accessories' },
    { name: 'Sale', path: '/products?sale=true' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-light shadow-lg' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight gradient-text">
                APEX
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}              <button
                onClick={() => setShowGlobalSearch(true)}
                className="p-2 text-gray-700 hover:text-black transition-colors duration-200"
                aria-label="Search"
              >
                <HiOutlineSearch className="w-6 h-6" />
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-black transition-colors duration-200">
                    <HiOutlineUser className="w-6 h-6" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      My Profile
                    </Link>                    {user?.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Admin Dashboard
                      </Link>
                    ) : null}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <HiOutlineShoppingBag className="w-6 h-6" />                {totalQuantity > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalQuantity}
                  </span>
                ) : null}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <HiOutlineShoppingBag className="w-6 h-6" />                {totalQuantity > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                ) : null}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-black transition-colors duration-200"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <HiOutlineX className="w-6 h-6" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>          {/* Search Bar */}
          {isSearchOpen ? (
            <div className="pb-4 animate-slide-up">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 transition-colors duration-200"
                >
                  Search
                </button>
              </form>
            </div>
          ) : null}
        </div>        {/* Mobile Menu */}
        {isMenuOpen ? (
          <div className="lg:hidden bg-white border-t animate-slide-up"><div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <button
                onClick={() => setShowGlobalSearch(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <HiOutlineSearch className="w-5 h-5" />
                <span>Search products, pages...</span>
              </button>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block py-2 text-gray-700 hover:text-black font-medium transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Actions */}
              <div className="border-t pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 py-2">
                      <HiOutlineUser className="w-5 h-5 text-gray-700" />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Link
                      to="/profile"
                      className="block py-2 text-gray-700 hover:text-black transition-colors duration-200"
                    >
                      My Profile
                    </Link>                    {user?.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="block py-2 text-gray-700 hover:text-black transition-colors duration-200"
                      >
                        Admin Dashboard
                      </Link>
                    ) : null}
                    <button
                      onClick={handleLogout}
                      className="block py-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block py-2 text-gray-700 hover:text-black font-medium transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block py-2 text-gray-700 hover:text-black font-medium transition-colors duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}              </div>
            </div>
          </div>
        ) : null}
      </nav>

      {/* Global Search Modal */}
      <GlobalSearch 
        isOpen={showGlobalSearch} 
        onClose={() => setShowGlobalSearch(false)} 
      />
      
      {/* Mobile Cart */}
      <MobileCart />
    </>
  );
};

export default Navbar;
