import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  auth,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
} from "../../backend/controllers/firebaseController.js";
import { parsePhoneNumber, isValidNumber } from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);
  const [countryCode, setCountryCode] = useState("us");
  const recaptchaVerifierRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAuthState = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Component mounted. Initializing reCAPTCHA...");
    initializeRecaptcha();

    return () => {
      if (recaptchaVerifierRef.current) {
        console.log("Component unmounting. Cleaning up reCAPTCHA...");
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const initializeRecaptcha = () => {
    console.log("Initializing RecaptchaVerifier...");
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA solved successfully. Response:", response);
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired. Reinitializing...");
              initializeRecaptcha();
            },
          }
        );
        console.log("RecaptchaVerifier initialized successfully.");
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
      }
    } else {
      console.log("RecaptchaVerifier already initialized.");
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      console.log("Parsing phone number:", phoneNumber);
      try {
        const phoneNumberParsed = parsePhoneNumber(phoneNumber, "IN");
        const newCountryCode =
          phoneNumberParsed?.country?.toLowerCase() || "us";
        console.log("Parsed country code:", newCountryCode);
        setCountryCode(newCountryCode);
      } catch (error) {
        console.error("Error parsing phone number:", error);
        setCountryCode("us");
      }
    }
  }, [phoneNumber]);

  const formatPhoneNumber = (number) => {
    console.log("Formatting phone number:", number);
    try {
      if (number.length < 10) {
        console.log("Phone number too short");
        return null;
      }
      const phoneNumberParsed = parsePhoneNumber(number, "IN");
      const validNumber = isValidNumber(phoneNumberParsed.number);
      console.log(
        "Formatted phone number:",
        validNumber ? phoneNumberParsed.number : "Invalid number"
      );
      return validNumber ? phoneNumberParsed.number : null;
    } catch (error) {
      console.error("Error formatting phone number:", error);
      return null;
    }
  };

  const handlePhoneChange = (e) => {
    console.log("Phone number input changed:", e.target.value);
    setPhoneNumber(e.target.value);
  };
  const generateToken = async (userId) => {
    try {
      const tokenResponse = await axios.post(
        "https://qdore-backend-final-final-last.vercel.app/api/users/auth/token",
        {
          userId, // Use the provided user ID
        }
      );

      // Assuming the token is returned in response.data.token
      if (tokenResponse.data && tokenResponse.data.token) {
        return tokenResponse.data.token; // Return the token
      } else {
        throw new Error("Token generation failed: No token returned");
      }
    } catch (error) {
      console.error("Error generating token:", error);
      throw error; // Rethrow the error for further handling
    }
  };
  const requestOTP = async () => {
    console.log("Requesting OTP for phone number:", phoneNumber);

    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      if (!formattedPhoneNumber) {
        console.error("Invalid phone number");
        return; // Show an error message to the user
      }

      console.log(
        "Formatted phone number ready for OTP:",
        formattedPhoneNumber
      );

      // Check if the phone number exists in the database
      const response = await axios.get(
        `https://qdore-backend-final-final-last.vercel.app/api/users/phone/${encodeURIComponent(
          formattedPhoneNumber
        )}`
      );

      const phoneExists = response.data.exists;
      if (phoneExists) {
        console.log("Phone number exists in database. Dispatching user data.");
        const userData = response.data.user; // Assuming the user data is returned in response.data.user

        console.log("User Data:", userData);

        // Generate a new token here
        const token = await generateToken(userData._id); // Call the function to generate the token
        console.log(token);
        // Dispatch the user data and token to Redux
        dispatch(
          setCredentials({
            ...response.data.user, // Include user data
            token, // Include the token
          })
        );
        // Navigate to the home page
        navigate("/");
      } else {
        console.log("Phone number not found, proceeding with OTP request...");

        // Initialize reCAPTCHA if not already done
        if (!recaptchaVerifierRef.current) {
          console.error("reCAPTCHA not initialized");
          await initializeRecaptcha();
          if (!recaptchaVerifierRef.current) {
            throw new Error("Failed to initialize reCAPTCHA");
          }
        }

        const appVerifier = recaptchaVerifierRef.current;
        console.log("Starting signInWithPhoneNumber...");
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhoneNumber,
          appVerifier
        );
        setConfirmResult(confirmationResult);
        console.log(
          "OTP sent successfully, confirmationResult:",
          confirmationResult
        );

        // Redirect to the page to verify OTP
        // You might want to show a modal/input to collect the OTP
      }
    } catch (error) {
      console.error("Error during OTP request:", error);
      if (recaptchaVerifierRef.current) {
        console.log("Clearing and reinitializing reCAPTCHA due to error.");
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      await initializeRecaptcha();
    }
  };

  const verifyOTP = async () => {
    console.log("Verifying OTP:", verificationCode);

    if (!confirmResult) {
      console.error("No confirmResult available");
      return;
    }

    try {
      const result = await confirmResult.confirm(verificationCode);
      console.log("Phone number verified successfully. Result:", result);
      const accessToken = await result.user.getIdToken();
      const { uid } = result.user;
      const userInfo = {
        _id: uid,
        displayName: null,
        phone: result.user.phoneNumber,
        token: accessToken, // Capture Firebase UID as fbUserId
      };
      console.log(userInfo);
      // User phone number successfully verified. Redirect to CompleteProfile
      // dispatch(setCredentials(userInfo));
      navigate("/completeProfile", { state: { user: userInfo } });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Show an error message to the user
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In successful. Result:", result.user);

      const { uid, displayName, email } = result.user;

      if (!uid || !email) {
        console.error("User ID or email is missing.");
        return;
      }

      // Get the access token using getIdToken
      const accessToken = await result.user.getIdToken();

      // Check if the user exists in your database
      try {
        const response = await axios.get(
          `https://qdore-backend-final-final-last.vercel.app/api/users/email/${encodeURIComponent(email)}`
        );

        if (response.data && response.data.user) {
          // User exists, dispatch credentials with token and navigate to home
          dispatch(
            setCredentials({
              ...response.data.user,
              token: accessToken, // Include the access token here
            })
          );
          navigate("/");
        } else {
          // User doesn't exist, redirect to add phone number
          console.log("User does not exist, redirecting to addPhone...");
          const userInfo = {
            _id: uid,
            displayName: displayName || "User",
            email: email,
            token: accessToken,
          };

          navigate("/addPhone", { state: { user: userInfo } });
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // User doesn't exist, redirect to add phone number
          console.log(
            "User not found in the database, redirecting to addPhone..."
          );
          const userInfo = {
            _id: uid,
            displayName: displayName || "User",
            email: email,
            token: accessToken,
          };
          navigate("/addPhone", { state: { user: userInfo } });
        } else {
          console.error("Error checking user in database:", error);
          // Handle other errors appropriately
        }
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
      // Show an error message to the user
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Login with OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your login details
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="flex">
                <div className="w-20 flex items-center justify-center bg-gray-100 border border-gray-300 border-r-0 rounded-l-md">
                  <img
                    src={`https://flagcdn.com/w20/${countryCode}.png`}
                    alt="Country flag"
                    onError={(e) => {
                      console.log(
                        "Error loading flag image, falling back to US flag"
                      );
                      e.target.onerror = null;
                      e.target.src = `https://flagcdn.com/w20/us.png`;
                    }}
                    className="w-6 h-4"
                  />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={requestOTP}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request OTP
              </button>
            </div>

            {confirmResult && (
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter OTP"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={verifyOTP}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or Login Using
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.2444 19.252C9.11376 19.252 6.45934 17.1399 5.50693 14.3003H1.51648V17.3912C3.55359 21.4434 7.70278 24.0008 12.24 24.0008Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M12.24 4.74966C13.9508 4.7232 15.6043 5.36697 16.8433 6.54867L20.2694 3.12262C18.1 1.0855 15.2207 -0.034466 12.24 0.000808666C7.70277 0.000808666 3.55359 2.55822 1.51648 6.61481L5.50252 9.70575C6.45052 6.86173 9.10935 4.74966 12.24 4.74966Z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </main>
      <div id="recaptcha-container" className="hidden"></div>
      <Footer />
    </div>
  );
};

export default Auth;
