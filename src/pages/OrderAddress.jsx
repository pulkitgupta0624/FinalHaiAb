import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify"; // Make sure to import toast for notifications

const OrderAddress = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (userInfo?.email) {
      fetchUserAddresses(userInfo.email);
    }
  }, [userInfo]);

  const fetchUserAddresses = async (email) => {
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/users/email/${encodeURIComponent(email)}`
      );

      // Log the response for debugging
      console.log("API Response:", response);

      if (!response.ok) {
        throw new Error("Failed to fetch addresses.");
      }

      const data = await response.json();

      // Log the fetched data
      console.log("Fetched data:", data);

      // Access the addresses correctly from the user object
      if (data.user && data.user.addresses) {
        console.log("Fetched addresses:", data.user.addresses); // Log the fetched addresses
        setAddresses(data.user.addresses); // Update state with the fetched addresses
      } else {
        console.error("Addresses not found in the response.");
      }
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setNewAddress((prevState) => ({ ...prevState, pincode }));

    if (pincode.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const postOfficeData = response.data[0]?.PostOffice[0];
        if (postOfficeData) {
          setNewAddress((prevState) => ({
            ...prevState,
            state: postOfficeData.State,
            city: postOfficeData.District,
          }));
        } else {
          console.error("No data found for this pincode");
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
      }
    }
  };

  const handleSaveAddress = async () => {
    try {
      const response = await fetch(
        "https://qdore-backend-final-final-last.vercel.app/api/users/save-address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: userInfo.email,
            address: newAddress,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error saving address:", errorData);
        throw new Error("Failed to save address.");
      }

      const data = await response.json();
      console.log("Response data:", data); // Log the response data

      // Check if data.address is defined
      if (!data.address) {
        console.error("No address returned from server.");
        throw new Error("No address returned from server.");
      }

      // Fetch the updated list of addresses
      fetchUserAddresses(userInfo.email);

      // Optionally navigate to Checkout with the new address
      navigate("/checkout", {
        state: {
          cart: [], // Pass the cart state if needed
          selectedAddress: { ...data.address, _id: data.address._id },
        },
      });
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewAddress({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    }); // Reset the form
  };

  // Function to handle address deletion
  const handleDeleteAddress = async (addressId) => {
    try {
      const token = userInfo.token;
      console.log("tokent", token);
      await axios.delete(
        `https://qdore-backend-final-final-last.vercel.app/api/users/delete-address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Address deleted successfully.");

      // Refetch the addresses after deletion
      fetchUserAddresses(userInfo.email);
    } catch (error) {
      toast.error("Failed to delete address.");
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-3xl font-bold mb-6">Select Delivery Address</h1>
        {addresses.map((address) => (
          <div
            key={address._id}
            className="border p-4 mb-4 rounded-lg shadow-lg"
          >
            <h2 className="text-lg font-semibold">{userInfo.username}</h2>
            <p>
              {address.addressLine1}, {address.addressLine2}, {address.city},{" "}
              {address.state} - {address.pincode}
            </p>
            <button
              onClick={() => {
                navigate("/checkout", {
                  state: {
                    cart: [], // Pass the cart state if needed
                    selectedAddress: address,
                  },
                });
              }}
              className="btn-theme btn bg-blue-500 text-white px-4 py-2 mt-4"
            >
              Deliver Here
            </button>
            <button
              onClick={() => handleDeleteAddress(address._id)}
              className="btn-theme btn bg-red-500 text-white px-4 py-2 mt-4 ml-2"
            >
              Delete Address
            </button>
          </div>
        ))}
        <button
          onClick={() => setShowForm(true)}
          className="btn-theme btn bg-green-500 text-white px-4 py-2 mt-4 mb-10"
        >
          Add New Address
        </button>
        {showForm && (
          <div className="border p-4 mt-6 rounded-lg shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4">New Address</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={newAddress.addressLine1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={newAddress.addressLine2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={handlePincodeChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="btn-theme btn bg-blue-500 text-white px-4 py-2"
                >
                  Save Address and Deliver Here
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-theme btn bg-gray-500 text-white px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderAddress;
