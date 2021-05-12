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
        src="/img/search.png"
		className="photo"
      />
      <img
        onClick={() => socialSignIn("facebook")}
        alt="facebook signin"
        src="/img/facebook.png"
		className="photo"
      />
    </div>
  );
};

export default SocialSignIn;
