import "./App.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./contexts/AuthContext";
import Authentification from "./pages/auth/Authentification";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import UpdateProduct from "./pages/products/UpdateProduct";
import ProductDetail from "./pages/products/ProductDetail";
import OrderList from "./pages/OrderList.jsx"
import OrderDetail from "./pages/OrderDetail";
import UpdateOrder from "./pages/UpdateOrder";
import Profile from "./pages/users/Profile";
import NotFound from "./pages/home/NotFound";

const theme = createTheme({});

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/authentification" />;
  }
  return children;
};

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
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
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrderList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <OrderDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/update-order/:id"
                element={
                    <ProtectedRoute>
                        <UpdateOrder />
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
          <Route path="/authentification" element={<Authentification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </MantineProvider>
  );
}
