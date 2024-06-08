import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, logoutUser, getUserInfo } from "../services/Api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const data = await getUserInfo();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const isTokenValid = async (accessToken) => {
    if (!accessToken) return false;

    const tokenPayload = parseJwt(accessToken);
    if (!tokenPayload || !tokenPayload.exp) return false;

    const expirationTime = tokenPayload.exp * 1000;
    const currentTime = Date.now();
    return expirationTime >= currentTime;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedAccessToken = localStorage.getItem("accessToken");
      const isValid = await isTokenValid(savedAccessToken);

      if (isValid) {
        setAccessToken(savedAccessToken);
        await fetchUserInfo();
        navigate("/");
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const credentials = { email, password };
      const data = await loginUser(credentials);
      const accessToken = data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
      await fetchUserInfo();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
