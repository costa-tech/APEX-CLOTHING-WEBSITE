import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  updatePassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user token
    const token = await user.getIdToken();
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    return {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        name: userData?.name || user.displayName,
        role: userData?.role || 'customer',
        ...userData
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw {
      response: {
        data: {
          message: error.message || 'Login failed'
        }
      }
    };
  }
};

export const register = async (userData) => {
  try {
    const { email, password, name } = userData;
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateFirebaseProfile(user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      role: 'customer',
      emailVerified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalOrders: 0,
        totalSpent: 0
      }
    });
    
    // Get user token
    const token = await user.getIdToken();
    
    return {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        name: name,
        role: 'customer'
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw {
      response: {
        data: {
          message: error.message || 'Registration failed'
        }
      }
    };
  }
};

export const verifyToken = async (token) => {
  try {
    // Get current user from Firebase
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user logged in');
    }
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        name: userData?.name || user.displayName,
        role: userData?.role || 'customer',
        ...userData
      }
    };
  } catch (error) {
    console.error('Token verification error:', error);
    throw {
      response: {
        data: {
          message: 'Invalid token'
        }
      }
    };
  }
};

export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      message: 'Password reset email sent successfully'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    throw {
      response: {
        data: {
          message: error.message || 'Failed to send password reset email'
        }
      }
    };
  }
};

export const resetPassword = async (token, password) => {
  // Note: Firebase handles password reset via email link
  // This function is kept for compatibility but not used in typical Firebase flow
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    await updatePassword(user, password);
    return {
      message: 'Password updated successfully'
    };
  } catch (error) {
    console.error('Password update error:', error);
    throw {
      response: {
        data: {
          message: error.message || 'Password update failed'
        }
      }
    };
  }
};

export const updateProfile = async (userData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), {
      ...userData,
      updatedAt: new Date().toISOString()
    });
    
    // Update Firebase Auth profile if name changed
    if (userData.name) {
      await updateFirebaseProfile(user, { displayName: userData.name });
    }
    
    return {
      message: 'Profile updated successfully',
      user: userData
    };
  } catch (error) {
    console.error('Profile update error:', error);
    throw {
      response: {
        data: {
          message: error.message || 'Profile update failed'
        }
      }
    };
  }
};

export const changePassword = async (passwordData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await updatePassword(user, passwordData.newPassword);
    
    return {
      message: 'Password changed successfully'
    };
  } catch (error) {
    console.error('Password change error:', error);
    throw {
      response: {
        data: {
          message: error.message || 'Password change failed'
        }
      }
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return {
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    throw {
      response: {
        data: {
          message: error.message || 'Logout failed'
        }
      }
    };
  }
};
