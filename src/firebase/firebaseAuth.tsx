import React, { useState, useEffect } from "react";
import firebaseApp from "./firebaseServer";

export const AuthContext = React.createContext<any>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => firebaseApp.auth().onAuthStateChanged(setCurrentUser), []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
