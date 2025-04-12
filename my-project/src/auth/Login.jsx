import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (response) => {
      const accesstoken = response.access_token;  
      console.log("Access token received:", accesstoken);
  
      const sendaccestoken = async () => {
        try {
          const response = await axios.post(
            `http://localhost:5000/sendaccestoken/${accesstoken}`,
            {},
            { withCredentials: true }
          );
  
          if (response.data.message === "User registered successfully") {
            console.log("Navigation triggered to /Home");
            navigate("/Home");
          } else {
            console.log("Error message:", response.data.message);
            setErrorMessage(response.data.message || "Unexpected error");
          }
        } catch (error) {
          console.error("Error sending access token to backend:", error);
        }
      };
  
      sendaccestoken();
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
    },
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.message === "User logged in successfully") {
        navigate("/Home");
        window.location.reload();
      } else {
        setErrorMessage(response.data.message || "Unexpected error");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
    <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg w-full max-w-md lg:w-96">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6">
        Login
      </h2>
  
      {errorMessage && (
        <div className="mb-4 text-yellow-600 text-center bg-red-100 p-2 rounded-full text-sm sm:text-base">
          {errorMessage}
        </div>
      )}
  
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-black font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-black rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>
  
        <div className="mb-6">
          <label htmlFor="password" className="block text-black font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-black rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-sm"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
  
        <button
          type="submit"
          className="w-full py-3 bg-yellow-400 text-black rounded-full mt-6 hover:bg-yellow-500 hover:text-black"
        >
          Login
        </button>
      </form>
  
      <p className="mt-6 text-center text-black text-sm sm:text-base">
        Don't have an account?{" "}
        <button
          onClick={handleSignupRedirect}
          className="text-yellow-500 hover:text-yellow-700 font-medium"
        >
          Sign Up
        </button>
      </p>
  
      <div className="mt-6 text-center text-sm sm:text-base">
        Or login with Google:
        <button
          className="text-blue-500 hover:underline ml-2"
          onClick={handleGoogleLogin}
        >
          Google Login
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default Login;
