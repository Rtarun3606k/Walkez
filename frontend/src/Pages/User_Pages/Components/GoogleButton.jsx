import React from "react";
import { useGoogleSignIn } from "../../../Utility/Firebase.config";
import { useNavigate } from "react-router-dom";

const GoogleButton = ({ isLogin }) => {
  const navigate = useNavigate();
  const signInWithGoogle = useGoogleSignIn(isLogin);

  const callGoogleSignIn = async (e) => {
    e.preventDefault();
    const response = await signInWithGoogle();
    console.log(response, "Google response");
    if (response === true) {
      navigate("/");
    }
  };

  return (
    <div
      className="google-button hover:text-white hover:bg-black transition-all ease-in-out duration-500 w-[75%] m-auto mt-2"
      onClick={callGoogleSignIn}
    >
      <img src="/logos/google.svg" alt="Google logo" />
      Continue with Google
    </div>
  );
};

export default GoogleButton;
