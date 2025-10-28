const { auth, db } = require('../config/firebase');

const usersCollection = db.collection('users');

/**
 * Register new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    // Create user document in Firestore
    const userData = {
      email,
      name,
      role: 'customer',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      joinDate: new Date().toISOString(),
    };

    await usersCollection.doc(userRecord.uid).set(userData);

    // Generate custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        name,
        customToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to register user',
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);

    // Check if user exists in Firestore
    const userDoc = await usersCollection.doc(userRecord.uid).get();

    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      const userData = {
        email: userRecord.email,
        name: userRecord.displayName || '',
        role: 'customer',
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await usersCollection.doc(userRecord.uid).set(userData);
    }

    const userData = userDoc.exists ? userDoc.data() : {};

    // Check if user is suspended
    if (userData.status === 'Suspended') {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been suspended',
      });
    }

    // Generate custom token with custom claims
    const customToken = await auth.createCustomToken(userRecord.uid, {
      role: userData.role || 'customer',
    });

    // Update last login
    await usersCollection.doc(userRecord.uid).update({
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userData.name || userRecord.displayName,
        role: userData.role || 'customer',
        customToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to login',
    });
  }
};

/**
 * Logout user
 */
exports.logout = async (req, res) => {
  try {
    // Firebase handles token invalidation on client side
    // Server doesn't maintain sessions

    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to logout',
    });
  }
};

/**
 * Refresh token
 */
exports.refreshToken = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required',
      });
    }

    // Get user data
    const userDoc = await usersCollection.doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userData = userDoc.data();

    // Generate new custom token
    const customToken = await auth.createCustomToken(uid, {
      role: userData.role || 'customer',
    });

    res.status(200).json({
      status: 'success',
      data: {
        customToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to refresh token',
    });
  }
};

/**
 * Forgot password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate password reset link
    const resetLink = await auth.generatePasswordResetLink(email);

    // In production, send email with reset link
    console.log('Password reset link:', resetLink);

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent',
      // Remove this in production
      data: { resetLink },
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    if (error.code === 'auth/user-not-found') {
      // Don't reveal if user exists
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists, a password reset email has been sent',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset',
    });
  }
};

/**
 * Reset password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { oobCode, newPassword } = req.body;

    if (!oobCode || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Reset code and new password are required',
      });
    }

    // Verify password reset code
    await auth.verifyPasswordResetCode(oobCode);

    // Reset password
    await auth.confirmPasswordReset(oobCode, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    if (error.code === 'auth/invalid-action-code') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset code',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password',
    });
  }
};

/**
 * Verify email
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { oobCode } = req.query;

    if (!oobCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Verification code is required',
      });
    }

    // Apply email verification
    await auth.applyActionCode(oobCode);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify email error:', error);

    if (error.code === 'auth/invalid-action-code') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification code',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to verify email',
    });
  }
};

/**
 * Resend verification email
 */
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate email verification link
    const verificationLink = await auth.generateEmailVerificationLink(email);

    // In production, send email with verification link
    console.log('Email verification link:', verificationLink);

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent',
      // Remove this in production
      data: { verificationLink },
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to resend verification email',
    });
  }
};
