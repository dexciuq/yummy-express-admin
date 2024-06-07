import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser, getUserInfo } from "../services/Api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
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

  useEffect(() => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (savedAccessToken && savedRefreshToken) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      fetchUserInfo();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const credentials = { email, password };
      const data = await loginUser(credentials);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      fetchUserInfo();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/authentification");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
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
