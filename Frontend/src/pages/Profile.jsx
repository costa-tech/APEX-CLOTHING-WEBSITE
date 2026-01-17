import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateUser } from '../store/slices/authSlice';
import { HiOutlineUser, HiOutlineLocationMarker, HiOutlineHeart, HiOutlineCreditCard, HiOutlineLogout, HiOutlineEye, HiOutlineTruck } from 'react-icons/hi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { updateProfile } from '../utils/userAPI';
import api from '../utils/api';
import { addToCartAsync } from '../store/slices/cartSlice';
import { removeFromWishlistAsync } from '../store/slices/wishlistSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    }
  }, [user]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  // Fetch wishlist when wishlist tab is active
  useEffect(() => {
    if (activeTab === 'wishlist' && user) {
      fetchWishlist();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      console.log('📦 Fetching user orders...');
      const response = await api.get('/orders/my-orders');
      console.log('✅ Orders fetched:', response);
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast.error('Failed to load order history');
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      console.log('💖 Fetching user wishlist...');
      const response = await api.get('/wishlist');
      console.log('✅ Wishlist fetched:', response);
      
      // Map the response to match the expected format
      const wishlistData = response.wishlist?.items || response.items || [];
      const formattedWishlist = wishlistData.map(item => ({
        id: item.product?.id || item.product?._id || item.product_id,
        name: item.product?.name || 'Unknown Product',
        price: Number(item.product?.salePrice || item.product?.price || 0),
        originalPrice: item.product?.price ? Number(item.product.price) : null,
        image: item.product?.images?.[0] || '/placeholder-image.jpg',
        inStock: (item.product?.stock || 0) > 0,
        _id: item.id, // Backend item ID for removal
      }));
      
      setWishlist(formattedWishlist);
    } catch (error) {
      console.error('❌ Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await dispatch(addToCartAsync({
        productId: item.id,
        size: 'M', // Default size
        color: 'Default',
        quantity: 1
      })).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await dispatch(removeFromWishlistAsync(itemId)).unwrap();
      // Refresh wishlist
      fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      console.log('💾 Saving profile:', formData);
      
      // Prepare data for API
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address
      };

      const response = await updateProfile(profileData);
      console.log('✅ Profile updated:', response);
      
      // Update user in Redux store
      dispatch(updateUser({
        ...user,
        ...profileData
      }));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'account', name: 'Account Info', icon: HiOutlineUser },
    { id: 'orders', name: 'Order History', icon: HiOutlineTruck },
    { id: 'addresses', name: 'Addresses', icon: HiOutlineLocationMarker },
    { id: 'wishlist', name: 'Wishlist', icon: HiOutlineHeart },
    { id: 'payment', name: 'Payment Methods', icon: HiOutlineCreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <HiOutlineUser className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-left rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <HiOutlineLogout className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Account Info Tab */}
              {activeTab === 'account' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Information</h1>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="(123) 456-7890"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="address.street"
                            value={formData.address?.street || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={formData.address?.city || ''}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              State/Province
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address?.state || ''}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              ZIP/Postal Code
                            </label>
                            <input
                              type="text"
                              name="address.zipCode"
                              value={formData.address?.zipCode || ''}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="address.country"
                              value={formData.address?.country || ''}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order History</h1>
                  
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <HiOutlineTruck className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders yet</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Start shopping to see your orders here.
                      </p>
                      <button
                        onClick={() => navigate('/products')}
                        className="mt-4 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">Order #{order.orderNumber || order.id}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                              </span>
                              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                Rs. {order.total ? order.total.toFixed(2) : '0.00'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items && order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {item.name || item.productName || 'Unknown Product'}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                                    {item.size && `Size: ${item.size}`}
                                    {item.color && `, Color: ${item.color}`}
                                    {item.quantity && `, Qty: ${item.quantity}`}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  Rs. {item.price || item.total || '0.00'}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button 
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              <HiOutlineEye className="w-4 h-4 mr-1" />
                              View Details
                            </button>
                            {(order.status === 'delivered' || order.status === 'completed') && (
                              <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                                Reorder
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                                Track Package
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Addresses</h1>
                  </div>
                  
                  <div className="text-center py-12">
                    <HiOutlineLocationMarker className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Address Management Coming Soon</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      You can update your default address in Account Info tab.
                    </p>
                    <button
                      onClick={() => setActiveTab('account')}
                      className="mt-4 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      Go to Account Info
                    </button>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Wishlist</h1>
                  
                  {wishlistLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <HiOutlineHeart className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Your wishlist is empty</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Start adding items you love to your wishlist.
                      </p>
                      <button
                        onClick={() => navigate('/products')}
                        className="mt-4 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover cursor-pointer"
                            onClick={() => navigate(`/products/${item.id}`)}
                          />
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                onClick={() => navigate(`/products/${item.id}`)}>
                              {item.name}
                            </h3>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Rs. {Number(item.price || 0).toFixed(2)}
                                </span>
                                {item.originalPrice && item.originalPrice !== item.price && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                                    Rs. {Number(item.originalPrice || 0).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.inStock
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddToCart(item)}
                                disabled={!item.inStock}
                                className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Add to Cart
                              </button>
                              <button 
                                onClick={() => handleRemoveFromWishlist(item._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 border border-red-600 dark:border-red-400 rounded-md"
                                title="Remove from wishlist"
                              >
                                <HiOutlineHeart className="w-5 h-5 fill-current" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Methods</h1>
                  </div>
                  
                  <div className="text-center py-12">
                    <HiOutlineCreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Payment Management Coming Soon</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      You can securely pay during checkout using various payment methods.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="mt-4 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
