import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { __AUTH } from "../backend/firebaseConfig";

export const AuthUser = createContext(null);

const AuthuserContext = ({ children }) => {
  let [authusers, setAuthUsers] = useState(null);
  // console.log(authusers);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(__AUTH, (user) => {
      if (user?.emailVerified === true) {
        setAuthUsers(user);
        window.localStorage.setItem("access token", user?.accessToken);
        // console.log(user);
      } else {
        setAuthUsers(null);
        window.localStorage.removeItem("access token");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  let logout = async () => {
    await signOut(__AUTH);
    window.localStorage.removeItem("access token");
    window.location.replace("/");
  };
  return (
    <AuthUser.Provider value={{ authusers, loading, logout }}>
      {!loading && children}
    </AuthUser.Provider>
  );
};

export default AuthuserContext;
