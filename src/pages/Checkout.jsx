import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import "./checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const selectedAddress = location.state?.selectedAddress;

  useEffect(() => {
    fetchCart();
    loadRazorpayScript();
  }, [userInfo]);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully");
    script.onerror = () =>
      setError("Failed to load Razorpay. Please try again later.");
    document.body.appendChild(script);
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/users/objectIdexport?fbUserId=${userInfo.fbUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Error fetching user data: " + error.message);
      return null;
    }
  };

  const fetchCart = async () => {
    const userData = await fetchUserData();
    if (!userData || !userData._id) {
      toast.error("Failed to fetch user information.");
      return;
    }

    const mongoUserId = userData._id;
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/cart/${mongoUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();
      console.log("Fetched cart data:", data);

      if (!data || !data.products) {
        throw new Error("Cart not found for the user");
      }

      setCart(data.products || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Error fetching cart: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    setIsProcessingPayment(true);
    setError(null);

    const userData = await fetchUserData();
    if (!userData || !userData._id) {
      toast.error("Failed to fetch user information.");
      setIsProcessingPayment(false);
      return;
    }

    const mongoUserId = userData._id;

    if (paymentMethod === "cod") {
      try {
        const orderdata = {
          userId: mongoUserId,
          address: selectedAddress,
          items: cart,
          paymentMethod: "Cash on Delivery",
          amount: totalPrice,
        };

        const orderResponse = await fetch(
          "https://qdore-backend-final-final-last.vercel.app/api/users/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(orderdata),
          }
        );

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(`Failed to save order: ${errorData.message}`);
        }

        const orderData = await orderResponse.json();
        localStorage.setItem("orderDetails", JSON.stringify(orderData));

        setSuccessMessage(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error("Error saving order:", error);
        setError("Error saving order: " + error.message);
      } finally {
        setIsProcessingPayment(false);
      }
      return;
    }

    // Online Payment Flow using Razorpay
    try {
      const options = {
        key: "rzp_test_CYxrsd4LgcyNmb",
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        name: "Your Company",
        description: "Test Transaction",
        handler: async function (response) {
          try {
            const orderdata = {
              userId: mongoUserId,
              address: selectedAddress,
              items: cart,
              paymentId: response.razorpay_payment_id,
              paymentMethod: "Online Payment",
              amount: totalPrice,
            };

            const orderResponse = await fetch(
              "https://qdore-backend-final-final-last.vercel.app/api/users/orders",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify(orderdata),
              }
            );

            if (!orderResponse.ok) {
              const errorData = await orderResponse.json();
              throw new Error(`Failed to save order: ${errorData.message}`);
            }

            const orderData = await orderResponse.json();
            localStorage.setItem("orderDetails", JSON.stringify(orderData));

            setSuccessMessage(true);
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
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Error processing payment: " + error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleChangeAddress = () => {
    navigate("/orderAddress");
  };

  const getImageUrl = (ipfsHash) => {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 mt-10">
          <p>Loading cart information...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        {successMessage && (
          <div className="thank-you-message animate__animated animate__fadeIn">
            <h2 className="text-2xl font-bold text-green-600">
              Thank you for shopping with us!
            </h2>
            <p>Your order has been successfully placed.</p>
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Summary */}
          <div className="border p-4 rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Order Summary
            </h2>
            {cart.length > 0 ? (
              cart.map((item) => {
                const imageUrl = getImageUrl(item.image);
                return (
                  <div
                    key={item.productId}
                    className="flex items-center border-b py-2 mb-2"
                  >
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover mr-4 rounded-lg shadow"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-700">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
            <p className="text-xl font-semibold mt-4 text-blue-600">
              Total Price: ${totalPrice.toFixed(2)}
            </p>
          </div>

          {/* Payment and Address */}
          <div className="border p-4 rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Payment Method
            </h2>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <span className="ml-2">Online Payment</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
            </div>

            <h2 className="text-xl font-semibold my-4 text-blue-600">
              Shipping Address
            </h2>
            {selectedAddress ? (
              <div className="bg-gray-100 p-3 rounded">
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.zipCode}
                </p>
                <p>{selectedAddress.country}</p>
              </div>
            ) : (
              <p className="text-red-500">No address selected</p>
            )}

            <div className="mt-6">
              <button
                className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded mb-2 ${
                  isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleOrder}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Processing..." : "Place Order"}
              </button>
              <button
                className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleChangeAddress}
              >
                Change Address
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
