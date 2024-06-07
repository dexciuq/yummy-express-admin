import "@mantine/core/styles.css";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import AuthProvider, { AuthContext } from "./contexts/AuthContext";
import Authentification from "./pages/auth/Authentification";
import Header from "./components/header/Header";
import Home from "./pages/home/Home";
import AddProduct from "./pages/products/AddProduct";
import UpdateProduct from "./pages/products/UpdateProduct";
import ProductDetail from "./pages/products/ProductDetail";
import Profile from "./pages/users/Profile";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/authentification" />;
};

export default function App() {
  return (
    <AuthProvider>
      <MantineProvider>
        <Header />
        <Routes>
          <Route path="/authentification" element={<Authentification />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-product/:id"
            element={
              <ProtectedRoute>
                <UpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MantineProvider>
    </AuthProvider>
  );
}
