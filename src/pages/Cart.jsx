import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { FaTrashAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux"; // Import useSelector to access user info
import ConfirmationModal from "./ConfirmationModal"; // Ensure this path is correct

const Cart = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo); // Get user info from Redux state
  const [cart, setCart] = useState([]);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null); // New error state

  const fetchUserData = async () => {
    console.log(userInfo);
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/users/objectIdexport?fbUserId=${userInfo.fbUserId}`, // Ensure this retrieves MongoDB user
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

      const data = await response.json(); // This should return MongoDB user data
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Error fetching user data: " + error.message);
      return null;
    }
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();

    // Fetch cart data
    const fetchCart = async () => {
      if (!userInfo?._id) {
        console.error("User ID is missing");
        return;
      }

      const userData = await fetchUserData();
      if (!userData || !userData._id) {
        setError("Failed to fetch user information.");
        return;
      }

      const mongoUserId = userData._id; // Use MongoDB _id

      try {
        const response = await fetch(
          `https://qdore-backend-final-final-last.vercel.app/api/cart/${mongoUserId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`, // Add token if needed
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();
        setCart(data.products); // Update state with the products from the cart
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Error fetching cart: " + error.message);
      }
    };

    fetchCart();
  }, [userInfo]);

  const handleIncrease = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const openRemoveConfirmation = (productId) => {
    setItemToRemove(productId);
    setIsModalOpen(true);
  };

  const handleRemove = async () => {
    try {
      const userId = userInfo?._id;
      const token = userInfo?.token;

      if (!userId || !token) {
        throw new Error("User ID or token is missing");
      }

      if (!itemToRemove) {
        throw new Error("Product ID is missing");
      }

      const userData = await fetchUserData();
      if (!userData || !userData._id) {
        setError("Failed to fetch user information.");
        return;
      }

      const mongoUserId = userData._id; // Use MongoDB _id

      const url = `https://qdore-backend-final-final-last.vercel.app/api/cart/${mongoUserId}/remove/${itemToRemove}`;
      console.log("Removing item with URL:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Update local state after successful removal
      setCart((prevCart) =>
        prevCart.filter((item) => item._id !== itemToRemove)
      );
      setIsModalOpen(false);
      setItemToRemove(null);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Error removing item: " + error.message);
    }
  };

  const handleBuyNow = () => {
    navigate("/orderAddress", { state: { cart } });
  };

  const totalPrice = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-7xl mb-10 text-center font-futura">
          SHOPPING CART
        </h1>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Error message display */}
        {cart.length === 0 ? (
          <p>
            Your cart is empty.{" "}
            <Link to="/shop" className="text-blue-500">
              Shop more
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center border p-4 mb-4 rounded-lg shadow-lg"
                >
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${item.image}`} // Fetch image using the IPFS link
                    alt={item.name}
                    className="w-20 h-20 object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-700">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleDecrease(item._id)}
                        className="mx-2 px-2 py-1 border border-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="mx-2 px-2 py-1 border border-gray-300 w-12 text-center"
                      />
                      <button
                        onClick={() => handleIncrease(item._id)}
                        className="mx-2 px-2 py-1 border border-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => openRemoveConfirmation(item._id)}
                    className="text-black"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
            <div className="border p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <p className="text-gray-700">Total Price: ${totalPrice}</p>
              <button
                onClick={handleBuyNow}
                className="btn-theme btn bg-gray-800 text-white px-4 py-2 mt-4 w-full"
              >
                Buy Now
              </button>
              <Link
                to="/ourCollection"
                className="btn-theme btn bg-black text-white px-4 py-2 mt-4 w-full text-center block"
              >
                Shop More
              </Link>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRemove}
          itemName={cart.find((item) => item._id === itemToRemove)?.name} // Pass item name for confirmation
        />
      )}

      <Footer />
    </div>
  );
};

export default Cart;
