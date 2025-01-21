import React from "react";
import { useGoogleSignIn } from "../../../Utility/Firebase.config";

const GoogleButton = () => {
  const signInWithGoogle = useGoogleSignIn();

  return <button onClick={useGoogleSignIn}>Sign in with Google</button>;
};

export default GoogleButton;
