import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { Email, Lock, Login, PersonAdd } from "@mui/icons-material";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("blue");
  const [emailError, setEmailError] = useState(""); // Real-time email validation error
  const [passwordError, setPasswordError] = useState(""); // Real-time password validation error
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;


  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleAction = async (action) => {
    setMessage("");
    setMessageColor("blue");

    if (!email || !password) {
      setMessage("Email and password are required");
      setMessageColor("red");
      return;
    }

    if (emailError || passwordError) {
      setMessage("Please fix the errors before proceeding");
      setMessageColor("red");
      return;
    }

    try {
      if (action === "login") {
        const response = await axios.post("http://localhost:5000/api/login", {
          email,
          password,
        });
        if (response.status === 200) {
          const username = email.split("@")[0];
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username", username);
          navigate("/landing");
        }
      } else if (action === "signup") {
        const response = await axios.post("http://localhost:5000/api/signup", {
          email,
          password,
        });
        if (response.status === 201) {
          setMessage("Signup successful! Please login.");
          setMessageColor("green");
        } else if (response.status === 409) {
          setMessage("Email already taken");
          setMessageColor("red");
        }
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setMessageColor("red");
    }
  };

  return (
    <div className="auth-container">
      <h2>Authentication</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <Email className="icon" />
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
          />
        </div>
        {emailError && <p className="message" style={{ color: "red" }}>{emailError}</p>}
        <div className="input-group">
          <Lock className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
          />
        </div>
        {passwordError && <p className="message" style={{ color: "red" }}>{passwordError}</p>}
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>
        <div className="button-group">
          <button
            type="button"
            className="action-button"
            onClick={() => handleAction("login")}
          >
            <Login className="button-icon" /> Login
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => handleAction("signup")}
          >
            <PersonAdd className="button-icon" /> Signup
          </button>
        </div>
      </form>
      {message && (
        <p className="message" style={{ color: messageColor }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Auth;
