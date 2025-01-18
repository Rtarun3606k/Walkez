import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";

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
  photoURL
) => {
  //   e.preventDefault();
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;
  console.log(apiUrl);
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
    }),
  };

  const response = await fetch(`${apiUrl}/user_route/google-auth`, options);
  const data = await response.json();
  if (response.status === 200 || response.status === 201) {
    // alert(data.message);

    toast.success(data.message);
    navigate("/login");
  } else {
    toast.error(data.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // Contains user details like email, displayName, photoURL, etc.
    console.log("User signed in with Google:", user);
    console.log("User email:", user.email);
    console.log("User name:", user.displayName);
    console.log("User photo:", user.photoURL);
    console.log("User uid:", user.uid);
    console.log("User lastSignInTime:", user.metadata.lastSignInTime);
    console.log("User creationTime:", user.metadata.creationTime);
    console.log("User lastLoginAt:", user.metadata.lastLoginAt);
    console.log("User emailVerified:", user.emailVerified);

    // Call the register function
    await register(
      user.displayName,
      user.email,
      "",
      user.uid,
      user.metadata.lastSignInTime,
      user.metadata.creationTime,
      user.metadata.lastLoginAt,
      user.emailVerified,
      user.photoURL
    );

    return user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
  }
};
