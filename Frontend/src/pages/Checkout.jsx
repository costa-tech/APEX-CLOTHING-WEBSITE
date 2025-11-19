import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import { HiOutlineCreditCard, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineLockClosed } from 'react-icons/hi';
import { FiTag, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { validateCoupon } from '../utils/couponAPI';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector(state => state.cart);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    email: user?.email || '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    
    // Payment Information
    paymentMethod: 'cod', // 'cod' or 'bank_transfer'
    
    // Options
    saveInfo: false,
    shippingMethod: 'standard'
  });
  const [errors, setErrors] = useState({});

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 15.99 },
    { id: 'overnight', name: 'Overnight Shipping', time: 'Next business day', price: 29.99 }
  ];

  // Load user profile data and auto-fill form if user is logged in
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Auto-fill form with user's saved information
            setFormData(prev => ({
              ...prev,
              email: userData.email || user.email || prev.email,
              firstName: userData.firstName || userData.displayName?.split(' ')[0] || prev.firstName,
              lastName: userData.lastName || userData.displayName?.split(' ')[1] || prev.lastName,
              phone: userData.phone || prev.phone,
              address: userData.address || prev.address,
              apartment: userData.apartment || prev.apartment,
              city: userData.city || prev.city,
              state: userData.state || prev.state,
              zipCode: userData.zipCode || prev.zipCode,
              company: userData.company || prev.company,
            }));
            
            console.log('✅ Auto-filled checkout form with user profile data');
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Continue with checkout even if profile load fails
        }
      }
    };

    loadUserProfile();
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const orderAmount = calculateTotal();
      const response = await validateCoupon(couponCode.toUpperCase(), orderAmount);
      
      if (response.status === 'success') {
        setAppliedCoupon(response.data);
        toast.success(`Coupon "${response.data.code}" applied! You saved Rs. ${response.data.discountAmount.toFixed(2)}`);
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation
    if (formData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be in format (123) 456-7890';
    }

    // Payment method validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (formData.cvv && formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    // Billing address validation if different from shipping
    if (formData.differentBilling) {
      const billingFields = ['billingAddress', 'billingCity', 'billingState', 'billingZipCode'];
      billingFields.forEach(field => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 6) {
      return `(${v.substring(0, 3)}) ${v.substring(3, 6)}-${v.substring(6, 10)}`;
    } else if (v.length >= 3) {
      return `(${v.substring(0, 3)}) ${v.substring(3)}`;
    }
    return v;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const calculateShippingCost = () => {
    const method = shippingMethods.find(m => m.id === formData.shippingMethod);
    return method ? method.price : 0;
  };

  const calculateTax = () => {
    return (total + calculateShippingCost()) * 0.08;
  };

  const calculateTotal = () => {
    let finalTotal = total + calculateShippingCost() + calculateTax();
    if (appliedCoupon) {
      finalTotal -= appliedCoupon.discountAmount;
    }
    return Math.max(finalTotal, 0); // Ensure total doesn't go negative
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsProcessing(true);

    try {
      // Save user information if they're logged in and checked "Save Info"
      if (isAuthenticated && user?.uid && formData.saveInfo) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await getDoc(userDocRef).then(async (docSnap) => {
            const updateData = {
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
              address: formData.address,
              apartment: formData.apartment,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              company: formData.company,
              updatedAt: new Date().toISOString(),
            };

            if (docSnap.exists()) {
              // Update existing document
              const { updateDoc } = await import('firebase/firestore');
              await updateDoc(userDocRef, updateData);
            } else {
              // Create new document
              const { setDoc } = await import('firebase/firestore');
              await setDoc(userDocRef, {
                ...updateData,
                email: user.email,
                role: 'customer',
                createdAt: new Date().toISOString(),
              });
            }
          });
          console.log('✅ Saved user information to profile');
        } catch (error) {
          console.error('Error saving user info:', error);
          // Don't block checkout if save fails
        }
      }

      // Create order object
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        userId: user?.uid || null,
        customerInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'awaiting_confirmation',
        shippingMethod: formData.shippingMethod,
        subtotal: total,
        shippingCost: calculateShippingCost(),
        tax: calculateTax(),
        discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        total: calculateTotal(),
        orderStatus: 'processing',
        createdAt: new Date().toISOString(),
      };

      // Save order to Firestore
      const { collection, addDoc } = await import('firebase/firestore');
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, orderData);
      
      // Clear cart (pass userId if logged in)
      dispatch(clearCart({ userId: user?.uid }));
      
      // Show success message
      if (formData.paymentMethod === 'cod') {
        toast.success('Order placed! Pay cash on delivery.');
      } else {
        toast.success('Order received! Please complete bank transfer.');
      }
      
      // Redirect to order success page
      navigate('/order-success', { 
        state: { 
          ...orderData,
          paymentMethod: formData.paymentMethod,
        }
      });
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Logged in as {user.email}
              </span>
              <span className="text-gray-500">• Your information will be auto-filled</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Guest Checkout
              </span>
              <span className="text-gray-500">• Have an account?</span>
              <button
                onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="mt-4">
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment, suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      {/* Add more states as needed */}
                    </select>
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Save Info Checkbox - Only for logged-in users */}
                {isAuthenticated && (
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
                      Save this information for next time
                    </label>
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label key={method.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={formData.shippingMethod === method.id}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.time}</p>
                          </div>
                          <p className="font-medium text-gray-900">
                            {method.price === 0 ? 'Free' : `Rs. ${method.price}`}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <HiOutlineCreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Popular
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay with cash when your order is delivered to your doorstep
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Transfer payment directly to our bank account
                      </p>
                    </div>
                  </label>

                  {errors.paymentMethod && (
                    <p className="text-sm text-red-600">{errors.paymentMethod}</p>
                  )}
                </div>

                {/* Bank Details - Show only when bank transfer is selected */}
                {formData.paymentMethod === 'bank_transfer' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <HiOutlineShieldCheck className="w-5 h-5 mr-2 text-blue-600" />
                      Bank Account Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-medium text-gray-900">Commercial Bank of Ceylon</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-medium text-gray-900">Clothing Brand (Pvt) Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium text-gray-900 font-mono">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Branch:</span>
                        <span className="font-medium text-gray-900">Colombo Main Branch</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-gray-600">
                        <strong>Note:</strong> Please use your order number as the payment reference. 
                        Your order will be processed after payment confirmation (usually within 24 hours).
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineLockClosed className="w-5 h-5 mr-2" />
                    Complete Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Have a coupon code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                        disabled={couponLoading}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                      >
                        {couponLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Checking...
                          </>
                        ) : (
                          <>
                            <FiTag /> Apply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiTag className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Coupon "{appliedCoupon.code}" Applied
                          </p>
                          <p className="text-xs text-green-700">
                            You saved Rs. {appliedCoupon.discountAmount.toFixed(2)}!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Remove coupon"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">Rs. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateShippingCost() === 0 ? 'Free' : `Rs. ${calculateShippingCost().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Rs. {calculateTax().toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-medium">Discount ({appliedCoupon.code})</span>
                    <span className="font-medium">-Rs. {appliedCoupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      Rs. {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <HiOutlineShieldCheck className="w-5 h-5 mr-2" />
                  SSL encrypted checkout
                </div>
                <div className="flex items-center">
                  <HiOutlineTruck className="w-5 h-5 mr-2" />
                  Free returns within 30 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

