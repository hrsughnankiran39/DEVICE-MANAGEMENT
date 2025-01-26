import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Landing from "./Landing";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is authenticated

  return (
    <Router>
      <div>
        <Routes>
          {/* Route to Auth.js */}
          <Route path="/" element={<Auth />} />

          {/* Route to Landing.js - Redirect to Auth.js if not authenticated */}
          <Route
            path="/landing"
            element={
              isAuthenticated ? <Landing /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
