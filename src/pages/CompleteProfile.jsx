import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/slices/authSlice"; // Import your action
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

const CompleteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extract phone, fbUserId, and token from location.state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Access the user info from Redux state
  const user = location.state?.user; // Adjust the path based on your state structure

  useEffect(() => {
    console.log("Current user info from Redux:", user);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userData = {
      username: username,
      mobile: user.phone,
      email: email,
      fbUserId: user._id,
      token: user.token,
    };

    console.log("Submitting values:", userData);

    try {
      const response = await axios.post(
        "https://qdore-backend-final-final-last.vercel.app/api/users/",
        userData
      );
      console.log("Response from server:", response.data);

      // Dispatch user data along with token after successful profile creation
      dispatch(
        setCredentials({
          user: response.data.user, // Assuming your backend sends user data
          token: user.token, // Use the token from the response or fallback to the passed token
        })
      );

      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error(
        "Error saving user profile:",
        error.response?.data || error
      );
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CompleteProfile;
