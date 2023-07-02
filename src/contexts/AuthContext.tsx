import React, { useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import {
  firebaseAuth,
  firebaseStorage,
  githubProvider,
  googleProvider,
} from '../../src/firebase';
import { StorageReference, ref } from '@firebase/storage';

interface AuthContextProps {
  currentUser: User | null;
  userStorageRef: StorageReference | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextProps>(
  {} as AuthContextProps
);

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userStorageRef, setUserStorageRef] = useState<StorageReference | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const auth = firebaseAuth;

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  function loginWithGoogle() {
    return signInWithRedirect(auth, googleProvider);
  }

  function loginWithGitHub() {
    return signInWithRedirect(auth, githubProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const storageRef = ref(firebaseStorage, `${user.uid}/files.zip`);
        setUserStorageRef(storageRef);
        console.log('User is signed in.');
      } else {
        setCurrentUser(null);
        setUserStorageRef(null);
        console.log('No user is signed in.');
      }
      setLoading(false);
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setCurrentUser(result.user);
          const storageRef = ref(
            firebaseStorage,
            `${result.user.uid}/files.zip`
          );
          setUserStorageRef(storageRef);
          console.log('User is signed in.');
        } else {
          console.log('No user is signed in.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error occurred during redirect authentication:', error);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    login,
    logout,
    resetPassword,
    userStorageRef,
    loginWithGoogle,
    loginWithGitHub,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
