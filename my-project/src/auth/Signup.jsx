import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://pixvault.onrender.com/Signup', { username, email, password },{ withCredentials: true },{});

      if (response.status === 201) {
        navigate('/Home');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (response) => {
      const accesstoken = response.access_token;  
      console.log("Access token received:", accesstoken);
  
      const sendaccestoken = async () => {
        try {
          const response = await axios.post(
            `https://pixvault.onrender.com/sendaccestoken/${accesstoken}`,
            {},
            { withCredentials: true }
          );
  
          if (response.data.message === "User registered successfully") {
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
  <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg w-full max-w-md lg:w-96">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6">
      Create an Account
    </h2>

    {errorMessage && (
      <div className="mb-4 text-black text-center bg-red-100 p-2 rounded-full text-sm sm:text-base">
        {errorMessage}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="username" className="block text-black font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 border border-black rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
      </div>

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
          className="w-full px-4 py-3 border border-black rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-black font-medium">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-black rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-sm"
            onClick={togglePassword}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-yellow-400 text-black rounded-full mt-6 hover:bg-yellow-500 hover:text-black"
      >
        Sign Up
      </button>
    </form>

    <p className="mt-6 text-center text-black text-sm sm:text-base">
      Already have an account?{' '}
      <button
        onClick={handleLoginRedirect}
        className="text-yellow-500 hover:text-yellow-700 font-medium"
      >
        Login
      </button>
    </p>

    <div className="mt-6 text-center text-sm sm:text-base">
      Or signup with Google:
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

export default Signup;

