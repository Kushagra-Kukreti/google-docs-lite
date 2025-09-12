import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { provider } from "../firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUser(user || null));
    return () => unsub();
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
