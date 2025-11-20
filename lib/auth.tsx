import axiosInstance from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user?: User;
  token?: string;
  lastLogin?: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "authSession";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [lastLogin, setLastLogin] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as {
            user?: User;
            token?: string;
            lastLogin?: string;
          };
          setUser(parsed.user);
          setToken(parsed.token);
          setLastLogin(parsed.lastLogin);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post("/api/login", {
      email,
      password,
    });

    const { user: loggedInUser, token: receivedToken } = response.data as {
      user: User;
      token: string;
    };

    const loginTime = new Date().toISOString();

    setUser(loggedInUser);
    setToken(receivedToken);
    setLastLogin(loginTime);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: loggedInUser,
        token: receivedToken,
        lastLogin: loginTime,
      })
    );
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(undefined);
    setToken(undefined);
    setLastLogin(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, token, lastLogin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
