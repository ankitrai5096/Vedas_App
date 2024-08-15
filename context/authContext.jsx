import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create a Context for Auth
const AuthContext = createContext();

// Custom Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider Component that wraps your app and makes auth available
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // Listen to the Firebase Auth state and set the user
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Extract the uid and other relevant details
        const { uid, email, displayName } = firebaseUser;

        // Set the user state with the uid and other properties you might need
        setUser({ userId: uid, email, displayName });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
