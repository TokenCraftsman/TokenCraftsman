"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
      if (client.isAuthenticated()) {
        setUser(client.getIdentity().getPrincipal().toString());
      }
    });
  }, []);

  const login = async () => {
    authClient?.login({
      identityProvider: "http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai#authorize",
      onSuccess: () => {
        setUser(authClient.getIdentity().getPrincipal().toString());
      },
    });
  };

  const logout = async () => {
    authClient?.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
