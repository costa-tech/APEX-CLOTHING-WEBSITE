const { db, admin } = require('../config/firebase');

/**
 * Get user's wishlist
 * @route GET /api/v1/wishlist
 * @access Private
 */
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // Get wishlist from Firestore
    const wishlistRef = db.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();

    if (!wishlistDoc.exists) {
      return res.status(200).json({
        status: 'success',
        wishlist: {
          items: [],
        },
      });
    }

    const wishlistData = wishlistDoc.data();

    // Populate product details for each wishlist item
    const populatedItems = await Promise.all(
      wishlistData.items.map(async (item) => {
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
          return item;
        } catch (error) {
          console.error('Error fetching product:', error);
          return item;
        }
      })
    );

    wishlistData.items = populatedItems;

    res.status(200).json({
      status: 'success',
      wishlist: wishlistData,
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    next(error);
  }
};

/**
 * Add item to wishlist
 * @route POST /api/v1/wishlist
 * @access Private
 */
exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    // Support both productId and product_id
    const productId = req.body.productId || req.body.product_id;

    if (!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required',
      });
    }

    // Get product details to verify it exists
    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    // Get current wishlist
    const wishlistRef = db.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();

    let wishlistData;
    if (!wishlistDoc.exists) {
      wishlistData = {
        items: [],
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
    } else {
      wishlistData = wishlistDoc.data();
    }

    // Check if item already exists in wishlist
    const existingItem = wishlistData.items.find(item => item.product_id === productId);

    if (existingItem) {
      return res.status(400).json({
        status: 'error',
        message: 'Item already in wishlist',
      });
    }

    // Add new item
    wishlistData.items.push({
      id: `${productId}_${Date.now()}`,
      product_id: productId,
      addedAt: new Date().toISOString(),
    });

    wishlistData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Save to Firestore
    await wishlistRef.set(wishlistData, { merge: true });

    // Populate product details for response
    const populatedItems = await Promise.all(
      wishlistData.items.map(async (item) => {
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

    wishlistData.items = populatedItems;

    res.status(200).json({
      status: 'success',
      message: 'Item added to wishlist',
      wishlist: wishlistData,
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    next(error);
  }
};

/**
 * Remove item from wishlist
 * @route DELETE /api/v1/wishlist/:itemId
 * @access Private
 */
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;

    // Get current wishlist
    const wishlistRef = db.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();

    if (!wishlistDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Wishlist not found',
      });
    }

    const wishlistData = wishlistDoc.data();

    // Find and remove item
    const itemIndex = wishlistData.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in wishlist',
      });
    }

    wishlistData.items.splice(itemIndex, 1);
    wishlistData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Save to Firestore
    await wishlistRef.set(wishlistData);

    res.status(200).json({
      status: 'success',
      message: 'Item removed from wishlist',
      wishlist: wishlistData,
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    next(error);
  }
};

/**
 * Clear entire wishlist
 * @route DELETE /api/v1/wishlist
 * @access Private
 */
exports.clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // Clear wishlist in Firestore
    const wishlistRef = db.collection('wishlists').doc(userId);
    await wishlistRef.set({
      items: [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      status: 'success',
      message: 'Wishlist cleared',
      wishlist: {
        items: [],
      },
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    next(error);
  }
};
