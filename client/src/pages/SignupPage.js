// SignupPage.js
import React, { useState } from "react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../utils";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState([]);
  const signUp = useUserStore((state) => state.signUp);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate passwords
      const passwordErrors = validatePassword(password);
      const isValid = !passwordErrors.length;

      if (!isValid) {
        setErrors(passwordErrors);
        return;
      }

      await signUp({ email, password, username });
      navigate("/"); // Redirect to the home page after successful signup
    } catch (error) {
      setErrors([
        { isError: true, message: "An error occurred. Please try again." },
      ]);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      {errors.length > 0 && (
        <div className="mb-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500">
              {error.message}
            </p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            data-testId="username-input-field"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            data-testId="email-input-field"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            data-testId="password-input-field"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
