import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  MapPin,
  Package,
  LogOut,
  Edit,
  Plus,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (userInfo && userInfo._id) {
      fetchUserDetails(userInfo._id);
      fetchUserOrders(userInfo._id);
    } else {
      navigate("/auth");
    }
  }, [userInfo, navigate]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `https://qdore-backend-final-final-last.vercel.app/api/users/user-details/${userId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      const userData = response.data;
      setUserDetails(userData);
      setAddresses(userData.addresses || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const response = await axios.get(
        `https://qdore-backend-final-final-last.vercel.app/api/users/orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleEditProfile = () => {
    toast.info("Edit profile feature coming soon!");
  };

  const handleAddAddress = () => {
    navigate("/add-address");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-gray-100 font-sans">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 font-serif">
            My Profile
          </h1>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="flex border-b">
              {["profile", "addresses", "orders"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-6 text-center font-semibold ${activeTab === tab
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    } transition duration-300`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "profile" && <User className="inline-block mr-2" />}
                  {tab === "addresses" && (
                    <MapPin className="inline-block mr-2" />
                  )}
                  {tab === "orders" && <Package className="inline-block mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 font-serif">
                      Welcome, {userDetails.username || userInfo.username}!
                    </h2>
                    <button
                      onClick={handleEditProfile}
                      className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
                    >
                      <Edit className="mr-2" size={18} /> Edit Profile
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["email", "mobile"].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={field === "email" ? "email" : "text"}
                          value={userDetails[field] || userInfo[field] || "N/A"}
                          readOnly
                          className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 border border-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 font-serif">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={handleAddAddress}
                      className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
                    >
                      <Plus className="mr-2" size={18} /> Add New Address
                    </button>
                  </div>
                  {addresses.length > 0 ? (
                    addresses.map((address, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-lg mb-4 shadow"
                      >
                        <p className="font-semibold text-lg text-gray-800 mb-2">
                          {address.isDefault
                            ? "Default Address"
                            : `Address ${idx + 1}`}
                        </p>
                        <p className="text-gray-600">{address.addressLine1}</p>
                        <p className="text-gray-600">{address.addressLine2}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No addresses found. Add a new address to get started!
                    </p>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-serif">
                    Your Orders
                  </h2>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg mb-6 shadow"
                      >
                        <p className="font-semibold text-lg text-gray-800 mb-2">
                          Order #{index + 1}
                        </p>
                        <p className="text-gray-600 mb-2">
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="flex items-center">
                              <img
                                src={`https://ipfs.io/ipfs/${product.image}`}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg mr-4 shadow"
                              />
                              <span className="text-gray-700 font-medium">
                                {product.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
                          onClick={() => handleOrderClick(order._id)}
                        >
                          View Details <ArrowRight className="ml-2" size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No orders found. Start shopping to see your orders here!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 bg-gray-800 text-white px-6 py-3 rounded-full shadow hover:bg-gray-700 transition duration-300 flex items-center"
          >
            <LogOut className="mr-2" size={18} /> Logout
          </button>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
      <Footer/>
    </>
  );
};

export default MyProfile;
