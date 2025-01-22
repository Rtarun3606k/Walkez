import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { store_cookies_data } from "./Auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const register = async (
  user_name,
  user_email,
  user_password,
  user_firebase_uid,
  last_login,
  created_at,
  last_SigIn_Time,
  email_verified,
  photoURL,
  isLogin
) => {
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_name: user_name,
      user_email: user_email,
      user_password: user_password,
      user_firebase_uid: user_firebase_uid,
      last_login: last_login,
      created_at: created_at,
      last_SigIn_Time: last_SigIn_Time,
      email_verified: email_verified,
      photoURL: photoURL,
      isLogin: isLogin,
      isUId: isLogin ? user_firebase_uid : null,
    }),
  };

  try {
    const response = await fetch(`${apiUrl}/user_route/google-auth`, options);
    const data = await response.json();
    if (response.status === 200 || response.status === 201) {
      store_cookies_data(data.refresh_token, data.access_token);
      toast.success(data.message);
      return true;
    } else {
      toast.error(data.message);
      return false;
    }
  } catch (error) {
    toast.error("An error occurred during registration.");
    console.error("Error during registration:", error);
    return false;
  }
};

export const useGoogleSignIn = (isLogin) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in with Google:", user);

      const response = await register(
        user.displayName,
        user.email,
        "",
        user.uid,
        user.metadata.lastSignInTime,
        user.metadata.creationTime,
        user.metadata.lastLoginAt,
        user.emailVerified,
        user.photoURL,
        isLogin
      );
      return response;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return false;
    }
  };

  return signInWithGoogle;
};
