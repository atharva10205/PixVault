import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5000/Signup', { username, email, password });
      console.log(response.data);

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

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Create an Account</h2>
        {errorMessage && (
          <div className="mb-4 text-red-600 text-center bg-red-100 p-2 rounded-full">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-red-700 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-3 border border-red-300 rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-red-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-3 border border-red-300 rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-red-700 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-3 border border-red-300 rounded-full mt-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                onClick={togglePassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white rounded-full mt-6 hover:bg-red-600 hover:text-black"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-red-600">
          Already have an account?{' '}
          <button
            onClick={handleLoginRedirect}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
