import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { provider } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUser(user || null));
    return () => unsub();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      const userRef = doc(db, "users", signedInUser.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        //create user
       const response =  await setDoc(userRef, {
          uid: signedInUser.uid,
          email: signedInUser.email,
          displayName: signedInUser.displayName,
          photoURL: signedInUser.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          boards: [],
          ownedBoards: [],
          roleMap: {},
          lastSeen: serverTimestamp(),
          isOnline: true,
          theme: "light",
          notificationsEnabled: true,
        });
        console.log("user create in db",response);
        
      } else {
        //update info if user exists 
        await updateDoc(userRef, {
          lastSeen: serverTimestamp(),
          isOnline: true,
        });
      }

    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  const logout = () => signOut(auth);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
