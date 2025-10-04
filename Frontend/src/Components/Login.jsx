import React, { useState } from "react";
import "../Styles/login.css";
import { useNavigate } from "react-router-dom";
import loginServices from "../Services/loginService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // for inline error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // reset message on submit


  try {
    const data = await loginServices.login(email, password);
    console.log("Login API response:", data);  

    if (data.status === "success") {
      const user = data.data?.user || data.user; // handle both response shapes
      const token = data.data?.token || data.token;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved:", token);
      }

      navigate("/home", { state: { message: `Welcome ${user?.firstName || "User"}!` } });
    } else {
      setMessage(data.message || "Invalid Credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    setMessage("Something went wrong. Please try again.");
  }
};
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        {/* Inline message */}
        {message && <div className="message error">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email/Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
