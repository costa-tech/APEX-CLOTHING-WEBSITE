const { db, storage } = require('../config/firebase');

const productsCollection = db.collection('products');

/**
 * Get all products with optional filters
 */
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      sortBy = 'createdAt',
      order = 'desc',
      minPrice,
      maxPrice,
    } = req.query;

    let query = productsCollection;

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    if (minPrice) {
      query = query.where('price', '>=', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.where('price', '<=', parseFloat(maxPrice));
    }

    // Apply sorting
    query = query.orderBy(sortBy, order);

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(skip);

    const snapshot = await query.get();
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Get total count
    const totalSnapshot = await productsCollection.get();
    const total = totalSnapshot.size;

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
};

/**
 * Get product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
    });
  }
};

/**
 * Get products by category
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const snapshot = await productsCollection
      .where('category', '==', category)
      .limit(parseInt(limit))
      .offset(skip)
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      status: 'success',
      data: { products },
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
};

/**
 * Search products
 */
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const snapshot = await productsCollection.get();
    
    const products = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const searchText = `${data.name} ${data.description} ${data.brand} ${data.tags?.join(' ')}`.toLowerCase();
      
      if (searchText.includes(query.toLowerCase())) {
        products.push({
          id: doc.id,
          ...data,
        });
      }
    });

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = products.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        products: paginatedProducts,
        total: products.length,
      },
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search products',
    });
  }
};

/**
 * Create new product (Admin only)
 */
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.uid,
      sales: 0,
      views: 0,
      images: req.body.images || [],
    };

    const docRef = await productsCollection.add(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        id: docRef.id,
        ...productData,
      },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
    });
  }
};

/**
 * Update product (Admin only)
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    };

    await productsCollection.doc(id).update(updateData);

    const updatedDoc = await productsCollection.doc(id).get();

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
    });
  }
};

/**
 * Delete product (Admin only)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    await productsCollection.doc(id).delete();

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
    });
  }
};

/**
 * Update product stock (Admin only)
 */
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid stock value',
      });
    }

    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    await productsCollection.doc(id).update({
      stock: parseInt(stock),
      status: parseInt(stock) === 0 ? 'Out of Stock' : 'Active',
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await productsCollection.doc(id).get();

    res.status(200).json({
      status: 'success',
      message: 'Stock updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update stock',
    });
  }
};

/**
 * Upload product images (Admin only)
 */
exports.uploadImages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No files uploaded',
      });
    }

    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    const bucket = storage.bucket();
    const uploadedImages = [];

    for (const file of req.files) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileName = `products/${id}/${timestamp}-${random}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      uploadedImages.push(publicUrl);
    }

    const currentData = doc.data();
    const updatedImages = [...(currentData.images || []), ...uploadedImages];

    await productsCollection.doc(id).update({
      images: updatedImages,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      status: 'success',
      message: 'Images uploaded successfully',
      data: {
        images: uploadedImages,
      },
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload images',
    });
  }
};

/**
 * Delete product image (Admin only)
 */
exports.deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    const currentData = doc.data();
    const updatedImages = (currentData.images || []).filter((img, index) => index !== parseInt(imageId));

    await productsCollection.doc(id).update({
      images: updatedImages,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image',
    });
  }
};

/**
 * Upload product image to local storage (Frontend/public/Images)
 */
exports.uploadProductImage = async (req, res) => {
  try {
    const path = require('path');
    const fs = require('fs');

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file uploaded',
      });
    }

    const imageFile = req.files.image;
    const timestamp = Date.now();
    const fileName = `product-${timestamp}-${imageFile.name}`;
    
    // Path to Frontend/public/Images folder
    const uploadPath = path.join(__dirname, '../../Frontend/public/Images', fileName);

    // Create directory if it doesn't exist
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Move file to destination
    await imageFile.mv(uploadPath);

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        imagePath: `/Images/${fileName}`,
        fileName: fileName,
      },
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image',
    });
  }
};
