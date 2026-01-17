const { db, admin } = require('../config/firebase');

/**
 * Get user's cart
 * @route GET /api/v1/cart
 * @access Private
 */
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    console.log('🔍 GET /api/v1/cart - User ID:', userId);

    // Get cart from Firestore
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      console.log('📦 No cart found for user, returning empty cart');
      return res.status(200).json({
        status: 'success',
        cart: {
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        },
      });
    }

    const cartData = cartDoc.data();
    console.log('📦 Cart found with', cartData.items?.length || 0, 'items');

    // Populate product details for each cart item
    const populatedItems = await Promise.all(
      cartData.items.map(async (item) => {
        try {
          const productDoc = await db.collection('products').doc(item.product_id).get();
          if (productDoc.exists) {
            const productData = productDoc.data();
            return {
              ...item,
              product: {
                _id: productDoc.id,
                id: productDoc.id,
                name: productData.name,
                price: productData.price,
                salePrice: productData.salePrice,
                images: productData.images,
                category: productData.category,
                stock: productData.stock,
              },
            };
          }
          console.warn('⚠️ Product not found:', item.product_id);
          return item; // Return item without product details if product not found
        } catch (error) {
          console.error('Error fetching product:', error);
          return item;
        }
      })
    );

    cartData.items = populatedItems;

    console.log('✅ Sending cart response with', populatedItems.length, 'populated items');
    res.status(200).json({
      status: 'success',
      cart: cartData,
    });
  } catch (error) {
    console.error('❌ Get cart error:', error);
    next(error);
  }
};

/**
 * Add item to cart
 * @route POST /api/v1/cart
 * @access Private
 */
exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    // Support both productId and product_id
    const productId = req.body.productId || req.body.product_id;
    const { quantity, size, color, price } = req.body;

    console.log('🛒 POST /api/v1/cart - User:', userId, 'Product:', productId, 'Size:', size, 'Color:', color, 'Qty:', quantity);

    if (!productId || !quantity) {
      console.error('❌ Missing productId or quantity');
      return res.status(400).json({
        status: 'error',
        message: 'Product ID and quantity are required',
      });
    }

    // Get product details
    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      console.error('❌ Product not found:', productId);
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    const productData = productDoc.data();
    const itemPrice = price || productData.salePrice || productData.price;
    console.log('✅ Product found:', productData.name, 'Price:', itemPrice);

    // Get current cart
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    let cartData;
    if (!cartDoc.exists) {
      console.log('📦 Creating new cart for user');
      cartData = {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
    } else {
      console.log('📦 Updating existing cart with', cartDoc.data().items.length, 'items');
      cartData = cartDoc.data();
    }

    // Check if item already exists in cart
    const existingItemIndex = cartData.items.findIndex(
      item => item.product_id === productId && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      console.log('📦 Item exists, updating quantity');
      cartData.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      console.log('📦 Adding new item to cart');
      cartData.items.push({
        id: `${productId}_${size}_${color}_${Date.now()}`,
        product_id: productId,
        quantity,
        size,
        color,
        price: itemPrice,
        addedAt: new Date().toISOString(),
      });
    }

    // Recalculate totals
    cartData.totalQuantity = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    cartData.totalAmount = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    console.log('💾 Saving cart to Firestore - Total items:', cartData.items.length, 'Total qty:', cartData.totalQuantity, 'Total amount:', cartData.totalAmount);
    
    // Save to Firestore
    await cartRef.set(cartData, { merge: true });
    console.log('✅ Cart saved successfully to Firestore');

    // Populate product details for response
    const populatedItems = await Promise.all(
      cartData.items.map(async (item) => {
        try {
          const prodDoc = await db.collection('products').doc(item.product_id).get();
          if (prodDoc.exists) {
            const prodData = prodDoc.data();
            return {
              ...item,
              product: {
                _id: prodDoc.id,
                id: prodDoc.id,
                name: prodData.name,
                price: prodData.price,
                salePrice: prodData.salePrice,
                images: prodData.images,
                category: prodData.category,
                stock: prodData.stock,
              },
            };
          }
          return item;
        } catch (error) {
          console.error('Error fetching product:', error);
          return item;
        }
      })
    );

    cartData.items = populatedItems;

    console.log('✅ Sending response with', populatedItems.length, 'populated items');    res.status(200).json({
      status: 'success',
      message: 'Item added to cart',
      cart: cartData,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    next(error);
  }
};

/**
 * Update cart item quantity
 * @route PUT /api/v1/cart/:itemId
 * @access Private
 */
exports.updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid quantity is required',
      });
    }

    // Get current cart
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }

    const cartData = cartDoc.data();

    // Find and update item
    const itemIndex = cartData.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart',
      });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cartData.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cartData.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    cartData.totalQuantity = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    cartData.totalAmount = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Save to Firestore
    await cartRef.set(cartData);

    res.status(200).json({
      status: 'success',
      message: 'Cart item updated',
      cart: cartData,
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    next(error);
  }
};

/**
 * Remove item from cart
 * @route DELETE /api/v1/cart/:itemId
 * @access Private
 */
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;

    // Get current cart
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }

    const cartData = cartDoc.data();

    // Find and remove item
    const itemIndex = cartData.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart',
      });
    }

    cartData.items.splice(itemIndex, 1);

    // Recalculate totals
    cartData.totalQuantity = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    cartData.totalAmount = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Save to Firestore
    await cartRef.set(cartData);

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      cart: cartData,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    next(error);
  }
};

/**
 * Clear entire cart
 * @route DELETE /api/v1/cart
 * @access Private
 */
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // Clear cart in Firestore
    const cartRef = db.collection('carts').doc(userId);
    await cartRef.set({
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared',
      cart: {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    next(error);
  }
};
