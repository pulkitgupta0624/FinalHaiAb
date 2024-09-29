import User from "../models/user.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// controllers/userController.js

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, mobile, addresses } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    mobile,
    addresses: addresses || [], // Initialize addresses to an empty array if not provided
  });

  try {
    const savedUser = await newUser.save();
    const token = createToken(res, savedUser._id);

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      mobile: savedUser.mobile,
      addresses: savedUser.addresses,
      isAdmin: savedUser.isAdmin,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error details
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      const token = createToken(res, existingUser._id);

      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        mobile: existingUser.mobile,
        addresses: existingUser.addresses,
        isAdmin: existingUser.isAdmin,
        token, // Ensure token is included in the response
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } else {
    res.status(401).json({ message: "User not found" });
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile, // Assuming you've added a mobile field
      addresses: user.addresses || [], // Assuming you've added an addresses field
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    if (req.body.newAddress) {
      user.addresses.push({ address: req.body.newAddress });
    }

    if (req.body.editedAddress && req.body.addressId) {
      user.addresses = user.addresses.map((address) =>
        address._id.toString() === req.body.addressId
          ? { ...address, address: req.body.editedAddress }
          : address
      );
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      isAdmin: updatedUser.isAdmin,
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getAddressesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and select only the 'addresses' field
    const user = await User.findById(userId).select("addresses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};

const saveAddress = async (req, res) => {
  const { userEmail, address } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming addresses is an array in the User schema
    user.addresses.push(address);
    await user.save();

    // Return the new address, including any necessary fields (like _id)
    const savedAddress = user.addresses[user.addresses.length - 1]; // Get the last saved address
    res
      .status(201)
      .json({ message: "Address saved successfully", address: savedAddress });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Failed to save address" });
  }
};
const savingNameAndEmailAfterSignInViaPhone = async (req, res) => {
  try {
    const { username, email, mobile, firebaseUserId } = req.body;

    if (!username || !email || !mobile || !firebaseUserId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if a user with the same Firebase UID or mobile number already exists
    let user = await User.findOne({
      $or: [{ fbUserId: firebaseUserId }, { mobile }],
    });

    if (user) {
      // If the user exists, update their profile
      user.username = username;
      user.email = email;
      user.profileComplete = true;
    } else {
      // If the user doesn't exist, create a new one
      user = new User({
        username,
        email,
        mobile,
        profileComplete: true,
        fbUserId: firebaseUserId,
      });
    }

    // Save the user (either new or updated)
    await user.save();

    res.status(201).json({ message: "User profile saved successfully", user });
  } catch (error) {
    console.error("Error saving user profile:", error);
    res.status(500).json({ error: "Failed to save user profile" });
  }
};

const getUserbyemail = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email: email }); // Assuming you're using Mongoose

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const exportObjectIdviafId = async (req, res) => {
  const fbUserId = req.query.fbUserId;

  if (!fbUserId) {
    return res.status(400).json({ message: "Firebase user ID is required" });
  }

  try {
    // Find user by Firebase user ID
    const user = await User.findOne({ fbUserId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user object, including the MongoDB Object ID
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      // Add any other fields you want to return
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const NumberExistorNot = async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    // Find the user by phone number
    const user = await User.findOne({ mobile: phoneNumber });

    // Respond with whether the user exists and the user data
    if (user) {
      return res.json({ exists: true, user });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking phone number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const savinguseraftergmail = async (req, res) => {
  const { username, mobile, email, fbUserId } = req.body;

  // Validate required fields
  if (!username || !mobile || !email || !fbUserId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Format the mobile number
    let formattedMobile = mobile;
    if (!mobile.startsWith("+91")) {
      formattedMobile = mobile.startsWith("0")
        ? `+91${mobile.slice(1)}`
        : `+91${mobile}`;
    }

    // Create a new user
    const newUser = new User({
      username,
      mobile: formattedMobile,
      email,
      fbUserId,
      isAdmin: false, // Set to true if needed
      profileComplete: true, // Adjust based on your requirements
    });

    // Save user to the database
    await newUser.save();
    res
      .status(201)
      .json({ message: "User added successfully.", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getAddressesByUserId,
  saveAddress,
  savingNameAndEmailAfterSignInViaPhone,
  getUserbyemail,
  exportObjectIdviafId,
  NumberExistorNot,
  savinguseraftergmail,
};
