import React, { useState, useEffect } from "react";
import firebaseApp from "./firebaseServer";

export const AuthContext = React.createContext<any>(null);

export const AuthProvider: React.FC = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState<any>(true);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user: any) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
  }, []);
  if (loadingUser) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
