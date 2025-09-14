import React from "react";  // <-- add this
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import PostsList from "./components/PostsList";
import MyPosts from "./components/MyPosts";  // <-- import MyPosts
import Profile from "./components/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<PrivateRoute><PostsList /></PrivateRoute>} />
          <Route path="/my-posts" element={<PrivateRoute><MyPosts /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const { user } = React.useContext(require("./context/AuthContext").AuthContext); 
  return user ? children : <Navigate to="/" />;
}

export default App;
