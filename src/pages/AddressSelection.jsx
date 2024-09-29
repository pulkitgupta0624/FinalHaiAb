import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

const AddressSelection = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online"); // Default to online payment
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully");
    script.onerror = () =>
      setError("Failed to load Razorpay. Please try again later.");
    document.body.appendChild(script);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userInfo?._id) {
        throw new Error("User ID is missing");
      }

      try {
        const response = await fetch(
          `https://qdore-backend-final-final-last.vercel.app/api/users/${userInfo._id}/addresses`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const addresses = await response.json();
        setAddresses(addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Error fetching addresses: " + error.message);
      }
    };

    fetchAddresses();
  }, [userInfo]);

  const handleOrder = async () => {
    setIsProcessingPayment(true);
    setError(null);

    try {
      if (!selectedAddress) {
        throw new Error("Please select an address.");
      }

      // Destructure selectedAddress using the correct property names
      const { addressLine1, addressLine2, city, state, pincode, country } =
        selectedAddress;

      // Validate required fields
      if (!addressLine1 || !pincode) {
        throw new Error("Address line1 and postalCode are required.");
      }

      // Create the order details object
      const orderDetails = {
        userId: userInfo._id,
        address: {
          line1: addressLine1, // Updated property name
          line2: addressLine2 || "", // Optional field
          city,
          state,
          postalCode: pincode, // Updated property name
          country,
        },
        items: orderData.products,
        paymentMethod,
        amount: orderData.totalAmount,
      };

      if (paymentMethod === "online") {
        if (!window.Razorpay) {
          throw new Error(
            "Razorpay script not loaded. Please refresh the page and try again."
          );
        }

        const options = {
          key: "rzp_test_CYxrsd4LgcyNmb", // Replace with your Razorpay key
          amount: Math.round(orderData.totalAmount * 100),
          currency: "INR",
          name: "QDOREHOME",
          description: "Test Transaction",
          handler: async function (response) {
            try {
              orderDetails.paymentId = response.razorpay_payment_id; // Include payment ID for online payment
              const orderResponse = await fetch(
                "https://qdore-backend-final-final-last.vercel.app/api/users/buynoworder",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                  },
                  body: JSON.stringify(orderDetails),
                }
              );

              if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(`Failed to save order: ${errorData.message}`);
              }

              const savedOrderData = await orderResponse.json();
              localStorage.setItem(
                "orderDetails",
                JSON.stringify(savedOrderData)
              );

              // Show success message
              toast.success("Order placed successfully!");
              setTimeout(() => {
                navigate("/");
              }, 3000);
            } catch (error) {
              console.error("Error saving order:", error);
              setError("Error saving order: " + error.message);
            }
          },
          prefill: {
            name: userInfo?.username || "",
            email: userInfo?.email || "",
            contact: userInfo?.mobile || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          setError(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
      } else {
        // Handle COD order
        const orderResponse = await fetch(
          "https://qdore-backend-final-final-last.vercel.app/api/users/buynoworder",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(orderDetails),
          }
        );

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(`Failed to save order: ${errorData.message}`);
        }

        const savedOrderData = await orderResponse.json();
        localStorage.setItem("orderDetails", JSON.stringify(savedOrderData));

        // Show success message
        toast.success("Order placed successfully!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setError("Error processing order: " + error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Select Your Address</h2>
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <div
            key={address._id}
            className={`border p-4 rounded mb-2 cursor-pointer ${
              selectedAddress && selectedAddress._id === address._id
                ? "bg-gray-200"
                : ""
            }`}
            onClick={() => setSelectedAddress(address)}
          >
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode},{" "}
              {address.country}
            </p>
          </div>
        ))
      ) : (
        <p>No addresses found. Please add an address first.</p>
      )}
      <div className="mt-4">
        <label className="block mb-2">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="online">Online Payment</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>
      <button
        onClick={handleOrder}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        disabled={isProcessingPayment || !selectedAddress}
      >
        {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
    <Footer/>
    </>
  );
};

export default AddressSelection;
