"use client";
import Cookies from "js-cookie";

// Token storage keys
const ACCESS_TOKEN_KEY = "rental_guru_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "rental_guru_user";

// Function to get tokens from storage
export const getTokens = () => {
  if (typeof window === "undefined")
    return { accessToken: null, refreshToken: null };

  return {
    accessToken: Cookies.get(ACCESS_TOKEN_KEY),
    refreshToken: Cookies.get(REFRESH_TOKEN_KEY),
  };
};

// Function to set tokens in storage
export const setTokens = async (accessToken: string, refreshToken: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 });
};

// Function to clear tokens from storage
export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

// Function to get user from storage
export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = Cookies.get(USER_KEY);

  return user ? JSON.parse(user) : null;
};

// Function to set user in storage
export const setUser = (user: any) => {
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });
};

// Function to clear user from storage
export const clearUser = () => {
  Cookies.remove(USER_KEY);
};
