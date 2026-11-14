"use client";

import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { createContext } from "react";
import { api, setAuthToken } from "@/axios";
import { isAxiosError } from "axios";

export type User = {
  _id: string;
  name: string;
  email: string;
  image: string;
  address: string;
  role: string;
};

type AuthContextType = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  loading: boolean;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signUp: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/signin", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      setUser(data.user);
      toast.success("Амжилттай нэвтэрлээ!");
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("Имэйл эсвэл нууц үг буруу байна");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/signup", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      setUser(data.user);
      toast.success("Бүртгэл амжилттай үүслээ!");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Бүртгүүлж чадсангүй. Энэ имэйл бүртгэлтэй байж магадгүй.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(undefined);
    toast.success("Системээс гарлаа");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    const getUser = async () => {
      try {
        const { data } = await api.get("/auth/me", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUser(data);
      } catch (error) {
        // Only an auth rejection means the token is bad. Network errors / 503
        // (e.g. database down) must not log the user out.
        const status = isAxiosError(error) ? error.response?.status : undefined;
        if (status === 401 || status === 404) {
          localStorage.removeItem("token");
          setAuthToken(null);
        }
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
