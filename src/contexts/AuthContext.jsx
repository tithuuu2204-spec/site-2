import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState('traveler');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Auto-assign roles based on demo emails
        let assignedRole = 'traveler';
        if (currentUser.email === 'admin@explorehub.in') assignedRole = 'admin';
        if (currentUser.email === 'host@demo.explorehub.in') assignedRole = 'host';

        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserProfile(data);
            setRole(data.role || assignedRole);
          } else {
            const newProfile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              role: assignedRole,
              createdAt: new Date().toISOString(),
              savedExperiences: [],
              upcomingTrips: [],
              preferences: {}
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
            setRole(assignedRole);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          // Fallback if firestore fails
          setRole(assignedRole);
        }
      } else {
        setUserProfile(null);
        setRole('traveler');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  const value = {
    user,
    userProfile,
    role,
    loading,
    loginWithGoogle,
    logout,
    isHost: role === 'host',
    isAdmin: role === 'admin',
    isTraveler: role === 'traveler'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
