import React from "react";
import { doSignOut } from "../firebase/firebaseFunctions";
import { Button } from "@material-ui/core";

const SignOutButton = () => {
  return (
    <Button
      type="button"
      onClick={doSignOut}
      variant="contained"
      color="primary"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
