import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import Cookies from 'js-cookie';

// Providers - create lazily to avoid SSR issues
let googleProvider;
let facebookProvider;

const getGoogleProvider = () => {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
  }
  return googleProvider;
};

const getFacebookProvider = () => {
  if (!facebookProvider) {
    facebookProvider = new FacebookAuthProvider();
  }
  return facebookProvider;
};

// 🔧 Helper to extract token + role
const handleLogin = async (provider) => {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Force refresh to get latest custom claims (role)
  const tokenResult = await user.getIdTokenResult(true);

  // console.log(first)

  const token = tokenResult.token;
  const role = tokenResult.claims.role || 'USER';

  // Save token to cookies
  // Cookies.set("token", token, { expires: 7 });
  // Cookies.set("currentUserRole", role);
  // Return full user object

  return {
    user: {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      role,
    },
    token,
  };
};

// Export auth functions
export const signInWithGoogle = () => handleLogin(getGoogleProvider());
export const signInWithFacebook = () => handleLogin(getFacebookProvider());

export const logOut = async () => {
  if (auth) {
    await signOut(auth);
  }
  Cookies.remove('accessToken');
};
