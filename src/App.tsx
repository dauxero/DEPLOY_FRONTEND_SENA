import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Users from "./components/Users";
import Reports from "./components/Reports";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard role={userRole} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/products"
          element={isLoggedIn ? <Products /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={
            isLoggedIn && userRole === "Administrator" ? (
              <Users />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isLoggedIn && userRole === "Administrator" ? (
              <Reports />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
