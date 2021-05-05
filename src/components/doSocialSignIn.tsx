import React from "react";
import { doSocialSignIn } from "../firebase/firebaseFunctions";

const SocialSignIn = () => {
  const socialSignIn = async (provider: string) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignIn("google")}
        alt="google signin"
        src="/img/googleIcon.jpg"
      />
      <img
        onClick={() => socialSignIn("facebook")}
        alt="facebook signin"
        src="/img/facebookIcon.jpg"
      />
    </div>
  );
};

export default SocialSignIn;
