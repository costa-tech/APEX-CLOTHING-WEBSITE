import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  PrinterIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const OrderDetail = () => {
  const { id } = useParams(); // This is the orderNumber like 'ORD-123456789'
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Query Firestore for order with matching orderNumber
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('orderNumber', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          toast.error('Order not found');
          navigate('/admin/orders');
          return;
        }
        
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        // Transform Firestore data to component format
        const transformedOrder = {
          id: doc.id,
          orderNumber: data.orderNumber,
          status: data.orderStatus || 'processing',
          paymentStatus: data.paymentStatus || 'pending',
          paymentMethod: data.paymentMethod || 'cod',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt || data.createdAt,
          customer: {
            id: data.userId || 'guest',
            name: `${data.customerInfo?.firstName || ''} ${data.customerInfo?.lastName || ''}`.trim(),
            email: data.customerInfo?.email || '',
            phone: data.customerInfo?.phone || '',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center',
          },
          shippingAddress: {
            name: `${data.customerInfo?.firstName || ''} ${data.customerInfo?.lastName || ''}`.trim(),
            street: data.shippingAddress?.address || '',
            apartment: data.shippingAddress?.apartment || '',
            city: data.shippingAddress?.city || '',
            state: data.shippingAddress?.state || '',
            postalCode: data.shippingAddress?.zipCode || '',
            country: 'Sri Lanka',
          },
          items: data.items || [],
          subtotal: data.subtotal || 0,
          tax: data.tax || 0,
          shippingCost: data.shippingCost || 0,
          discount: data.discount || 0,
          total: data.total || 0,
          couponCode: data.couponCode || null,
          payment: {
            method: data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
            methodType: data.paymentMethod,
          },
          shipping: {
            method: data.shippingMethod || 'standard',
            trackingNumber: data.trackingNumber || null,
          },
        };
        
        setOrder(transformedOrder);
        console.log('✅ Loaded order:', transformedOrder);
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Failed to load order details');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  // Remove old mock data
  const mockOrder = {
    id: parseInt(id),
    orderNumber: `ORD-${String(id).padStart(6, '0')}`,
    status: 'Processing',
    paymentStatus: 'Paid',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    customer: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center',
    },
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
    },
    items: [
      {
        id: 1,
        name: 'Athletic Performance Tee',
        sku: 'APT-BLK-L',
        price: 49.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&crop=center',
        variant: 'Black / Large',
      },
      {
        id: 2,
        name: 'Premium Training Shorts',
        sku: 'PTS-NVY-M',
        price: 59.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop&crop=center',
        variant: 'Navy / Medium',
      },    ],
    subtotal: 159.97,
    tax: 12.80,
    shippingCost: 9.99,
    discount: 0,
    total: 182.76,
    payment: {
      method: 'Credit Card',
      last4: '4242',
      brand: 'Visa',
      transactionId: 'txn_1ABC123456789',
    },
    shipping: {
      method: 'Standard Shipping',
      carrier: 'UPS',
      trackingNumber: '1Z999AA1234567890',
      estimatedDelivery: '2024-01-20',
    },
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2024-01-15T10:30:00Z',
        description: 'Order received and confirmed',
        completed: true,
      },
      {
        status: 'Payment Confirmed',
        timestamp: '2024-01-15T10:35:00Z',
        description: 'Payment processed successfully',
        completed: true,
      },
      {
        status: 'Processing',
        timestamp: '2024-01-15T14:20:00Z',
        description: 'Order is being prepared for shipment',
        completed: true,
      },
      {
        status: 'Shipped',
        timestamp: null,
        description: 'Order has been shipped',
        completed: false,
      },
      {
        status: 'Delivered',
        timestamp: null,
        description: 'Order delivered to customer',
        completed: false,
      },
    ],
    notes: [
      {
        id: 1,
        author: 'System',
        content: 'Order automatically confirmed',
        timestamp: '2024-01-15T10:30:00Z',
        type: 'system',
      },
      {
        id: 2,
        author: 'Admin',
        content: 'Customer requested expedited processing',
        timestamp: '2024-01-15T11:00:00Z',
        type: 'admin',
      },
    ],
  };



  const updateOrderStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { doc: docRef, updateDoc } = await import('firebase/firestore');
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('orderNumber', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        const orderDocRef = docRef(db, 'orders', orderDoc.id);
        await updateDoc(orderDocRef, {
          orderStatus: newStatus,
          updatedAt: new Date().toISOString(),
        });
        
        setOrder(prev => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }));
        
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_confirmation':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusOptions = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/orders')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order {order.orderNumber}
                </h1>
                <p className="text-gray-600 mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <PrinterIcon className="w-4 h-4 mr-2" />
                Print
              </button>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                disabled={updating}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rs. {item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">No items in this order</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Order Placed</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {order.status === 'completed' || order.status === 'delivered' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <ClockIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Current Status</h3>
                      <p className="text-sm text-gray-600 mt-1 capitalize">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">Rs. {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Rs. {order.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">Rs. {order.tax.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-Rs. {order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-medium border-t pt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">Rs. {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Customer</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={order.customer.avatar}
                    alt={order.customer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </h3>
                    <p className="text-sm text-gray-500">Customer ID: {order.customer.id}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{order.customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{order.customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
                {order.shipping.trackingNumber && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <TruckIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Tracking: {order.shipping.trackingNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Payment</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm mb-2">
                  {order.payment.methodType === 'cod' ? (
                    <>
                      <BanknotesIcon className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900 font-medium">{order.payment.method}</span>
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900 font-medium">{order.payment.method}</span>
                    </>
                  )}
                </div>
                {order.couponCode && (
                  <p className="text-xs text-green-600 mt-2">
                    Coupon Applied: {order.couponCode} (-Rs. {order.discount.toFixed(2)})
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
