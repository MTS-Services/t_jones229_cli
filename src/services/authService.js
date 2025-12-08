import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import Cookies from 'js-cookie';

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// 🔧 Helper to extract token + role
const handleLogin = async (provider) => {
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
export const signInWithGoogle = () => handleLogin(googleProvider);
export const signInWithFacebook = () => handleLogin(facebookProvider);

export const logOut = async () => {
  await signOut(auth);
  Cookies.remove('accessToken');
};
