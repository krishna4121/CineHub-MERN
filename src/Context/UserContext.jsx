import React, { createContext, useEffect, useState } from "react";
import authApi from "../lib/authApi";

export const userContext = createContext();

const normalizeEmail = (email) => email.trim().toLowerCase();

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage;

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const response = await authApi.get("/auth/me");
      setCurrentUser(response.data.user);
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signUp = async ({ name, email, password, confirmPassword }) => {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName) {
      return { success: false, message: "Please enter your full name." };
    }

    if (!isValidEmail(normalizedEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long.",
      };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    try {
      const response = await authApi.post("/auth/signup", {
        name: trimmedName,
        email: normalizedEmail,
        password,
        confirmPassword,
      });

      setCurrentUser(response.data.user);

      return {
        success: true,
        message: response.data.message || "Account created successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Unable to create your account right now."),
      };
    }
  };

  const signIn = async ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    if (!password) {
      return { success: false, message: "Please enter your password." };
    }

    try {
      const response = await authApi.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      setCurrentUser(response.data.user);

      return {
        success: true,
        message: response.data.message || "Signed in successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Unable to sign you in right now."),
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.post("/auth/logout");
    } catch (error) {
      // Keep the UI responsive even if the cookie has already expired.
    } finally {
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAuthLoading,
    signin: !currentUser,
    username: currentUser?.name || "Guest",
    signIn,
    signUp,
    logout,
    Logout: logout,
    refreshSession,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserProvider;
