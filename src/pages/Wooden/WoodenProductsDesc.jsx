import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx"; // Adjust the path as necessary
import Footer from "../../components/Footer/Footer.jsx"; // Adjust the path as necessary
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import image61 from "../../assets/Lifestyle/Wooden/Fruit/fruit1.jpeg";
import image62 from "../../assets/Lifestyle/Wooden/Fruit/fruit2.jpeg";
import image63 from "../../assets/Lifestyle/Wooden/Fruit/fruit3.jpeg";
import image64 from "../../assets/wooden/wc66.png";

import image51 from "../../assets/Lifestyle/Wooden/Bowl/bowl1.jpeg";
import image52 from "../../assets/Lifestyle/Wooden/Bowl/bowl2.jpeg";
import image53 from "../../assets/Lifestyle/Wooden/Bowl/bowl3.jpeg";
import image54 from "../../assets/Lifestyle/Wooden/Bowl/bowl4.jpg";

import image41 from "../../assets/Lifestyle/Wooden/Cereal/cereal1.jpeg";
import image42 from "../../assets/Lifestyle/Wooden/Cereal/cereal2.jpeg";
import image43 from "../../assets/Lifestyle/Wooden/Cereal/cereal3.jpeg";
import image44 from "../../assets/Lifestyle/Wooden/Cereal/cereal4.jpg";

import image31 from "../../assets/Lifestyle/Wooden/Wavy/wavy1.jpeg";
import image32 from "../../assets/Lifestyle/Wooden/Wavy/wavy2.jpeg";
import image33 from "../../assets/Lifestyle/Wooden/Wavy/wavy3.jpg";
import image34 from "../../assets/wooden/wc33.png";

import image21 from "../../assets/Lifestyle/Wooden/SideTable/sidetable1.jpeg";
import image22 from "../../assets/Lifestyle/Wooden/SideTable/sidetable2.jpeg";
import image23 from "../../assets/Lifestyle/Wooden/SideTable/sidetable3.jpg";
import image24 from "../../assets/sidetables/side444.png";

import image11 from "../../assets/Lifestyle/Wooden/Candle/candle1.jpg";
import image12 from "../../assets/Lifestyle/Wooden/Candle/candle2.jpg";
import image13 from "../../assets/Lifestyle/Wooden/Candle/candle3.jpeg";
import image14 from "../../assets/Lifestyle/Wooden/Candle/candle4.jpg";
import image15 from "../../assets/CandleHolders/ch555.png";

// import image22 from '../../assets/wooden/wc22.png';
// import image33 from '../../assets/wooden/wc33.png';
// import image4 from '../../assets/wooden/wc4.png';
// import image5 from '../../assets/wooden/wc5.png';
import image66 from "../../assets/wooden/wc66.png";
import {
  FaChevronDown,
  FaTruck,
  FaTag,
  FaMoneyBillAlt,
  FaUndo,
  FaBusinessTime,
} from "react-icons/fa";
// Product images
const productImages = {
  "acacia-wood-candle-holder": [image11, image12, image13, image14, image15],
  "acacia-wood-side-table": [image21, image22, image23, image24],
  "acacia-wood-bowl-i": [image31, image32, image33, image34],
  "acacia-circular-wood-bowl-and-spoon-set": [
    image41,
    image42,
    image43,
    image44,
  ],
  "acacia-wood-bowl-and-serve-set": [image51, image52, image53, image54],
  "acacia-wood-bowl-ii": [image61, image62, image63, image64],
};

const products = [
  {
    id: "acacia-wood-candle-holder",
    name: "ACACIA WOOD CANDLE HOLDER",
    description: [
      "Crafted from sustainable, eco-friendly, and natural wood.",
      "Handmade pieces highlight exquisite Indian craftsmanship with a beautiful natural finish and unique wood grains.",
      "Elevate your home decor with these elegant and sustainable Candle Holders.",
      "Perfect to place on one of your consoles or on a side table.",
    ],
    price: 3200, // Changed to number
    material: "Acacia Wood",
    dimensions: "14x14x22 Inch"
  },
  {
    id: "acacia-wood-side-table",
    name: "ACACIA WOOD SIDE TABLE",
    description: [
      "Made from sustainable, eco-friendly, and natural materials.",
      "Showcases exquisite Indian craftsmanship with a stunning natural finish and beautiful wood grains.",
      "Elevate your dining experience with elegance and sustainability.",
    ],
    price: 9500, // Changed to number
    material: "Acacia Wood",
    dimensions: "14x14x22 Inch"
  },
  {
    id: "acacia-wood-bowl-i",
    name: "ACACIA WOOD BOWL-I",
    description: [
      "Experience the elegance of our beautifully handcrafted acacia wood bowl.",
      "Crafted from sustainable, eco-friendly, and natural materials.",
      "This exquisite piece showcases the finest Indian craftsmanship.",
      "Each bowl is handmade to perfection, highlighting a stunning natural finish and the unique beauty of wood grains.",
    ],
    price: 1400, // Changed to number
    material: "Acacia Wood",
    dimensions: "14x14x22 Inch"
  },
  {
    id: "acacia-circular-wood-bowl-and-spoon-set",
    name: "ACACIA CIRCULAR WOOD BOWL & SPOON SET",
    description: [
      "Made from sustainable, eco-friendly acacia wood.",
      "This piece showcases exquisite Indian craftsmanship with its natural finish and stunning wood grains.",
      "Elevate your dining experience with this elegant and eco-conscious addition.",
    ],
    price: 550, // Changed to number
    material: "Acacia Wood",
    dimensions: "14x14x22 Inch"
  },
  {
    id: "acacia-wood-bowl-and-serve-set",
    name: "ACACIA WOOD BOWL & SERVE SET",
    description: [
      "Made from sustainable, eco-friendly, and natural materials.",
      "Showcases exquisite Indian craftsmanship with a stunning natural finish and beautiful wood grains.",
      "Elevate your dining experience with elegance and sustainability.",
    ],
    price: 2300, // Changed to number
    material: "Acacia Wood",
    dimensions: "14x14x22 Inch"
  },
  {
    id: "acacia-wood-bowl-ii",
    name: "ACACIA WOOD BOWL-II",
    description: [
      "A versatile acacia wood bowl perfect for holding fruits or serving your favorite dish.",
      "Crafted from sustainably procured, eco-friendly wood.",
      "This handmade piece showcases the finest Indian craftsmanship.",
      "Enjoy its beautiful natural finish and stunning wood grains, adding a touch of elegance to any setting.",
    ],
    price: 1400, // Changed to number
    material: "Acacia Wood",
    dimensions: "14x14x22 Inch"
  },
];

const WoodenProductDesc = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [activeProduct, setActiveProduct] = useState(
    () => products.find((product) => product.id === productId) || products[0]
  );
  const [activeImg, setActiveImage] = useState(
    productImages[activeProduct.id] ? productImages[activeProduct.id][0] : ""
  );
  const [amount, setAmount] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [showCareInstructions, setShowCareInstructions] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (productImages[activeProduct.id]) {
      setActiveImage(productImages[activeProduct.id][0]);
    }
  }, [activeProduct]);

  const fetchUserData = async () => {
    console.log(userInfo);
    try {
      const response = await fetch(
        `https://qdore-backend-final-final-last.vercel.app/api/users/objectIdexport?fbUserId=${userInfo.fbUserId}`, // Assuming this retrieves MongoDB user
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

  const handleAddToCart = async () => {
    if (!userInfo) {
      // Redirect to /auth if not logged in
      navigate("/auth");
      return;
    }
    console.log(userInfo);
    const token = userInfo?.token;

    if (!token) {
      toast.error("Authentication token is missing.");
      return;
    }

    // Fetch MongoDB user data
    const userData = await fetchUserData();
    if (!userData || !userData._id) {
      toast.error("Failed to fetch user information.");
      return;
    }

    const mongoUserId = userData._id; // Use MongoDB _id

    try {
      const response = await fetch("https://qdore-backend-final-final-last.vercel.app/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: mongoUserId, // MongoDB user ID
          productId: activeProduct.id,
          name: activeProduct.name,
          price: Number(activeProduct.price),
          image: activeProduct.imageUrl,
          quantity: amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  const handleBuyNow = () => {
    if (!userInfo) {
      // Redirect to /auth if not logged in
      navigate("/auth");
      return;
    }
    const userId = userInfo?._id;

    if (!userId) {
      console.error("User ID is missing");
      alert("Please log in to purchase items.");
      return;
    }

    // Create an order object
    const orderData = {
      userId: userId,
      products: [
        {
          productId: activeProduct.id,
          name: activeProduct.name,
          quantity: amount,
          price: Number(activeProduct.price),
          image: activeProduct.imageUrl,
        },
      ],
      totalAmount: (Number(activeProduct.price) * amount).toFixed(2), // Calculate total amount
    };

    // Redirect to the Address Selection page with the order data
    navigate("/select-address", {
      state: { orderData },
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row items-start justify-center">
          {/* Main Image and Thumbnails */}
          <div className="flex flex-col lg:flex-row lg:gap-3 lg:w-1/2">
            {/* Main Image */}
            <div className="flex-shrink-0 lg:w-2/3">
              <img
                src={activeImg}
                alt="Main Product"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                style={{ maxHeight: "600px" }}
              />
            </div>
            {/* Thumbnail Images */}
            <div className="flex flex-row lg:flex-col lg:w-1/3 lg:mt-0 mt-4 justify-between">
              <div className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-3">
                {productImages[activeProduct.id] &&
                  productImages[activeProduct.id].map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-20 h-20 lg:w-1/3 lg:h-auto rounded-lg cursor-pointer hover:opacity-75"
                      onClick={() => {
                        setActiveImage(img);
                        setActiveImageIndex(index); // Set the active image index
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* productImages[activeProduct.id].map((img, index) */}

          {/* Product Details Section */}
          <div className="lg:w-1/2 flex flex-col lg:pl-8 lg:gap-6 mt-6 lg:mt-0">
            <h1 className="text-5xl lg:text-8xl font-bold text-black mb-4 ">
              {activeProduct.name}
            </h1>
            <ul className="text-gray-700 text-2xl list- ">
              {activeProduct.description.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>

            <h2 className="text-4xl font-semibold my-4">
            ₹{activeProduct.price.toFixed(2)}
            </h2>

            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <button
                  className="bg-gray-200 py-2 px-4 rounded-lg text-lg"
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                >
                  -
                </button>
                <span className="py-2 px-4 text-lg">{amount}</span>
                <button
                  className="bg-gray-200 py-2 px-4 rounded-lg text-lg"
                  onClick={() => setAmount(amount + 1)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart & Buy Now */}
              <button
                onClick={handleAddToCart}
                className="bg-black text-white py-2 px-6 rounded-xl"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-black text-white py-2 px-6 rounded-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Features Section */}
            <div className="flex justify-between py-6 mt-4 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-5">
                <IconFeature icon={<FaTruck />} text="Free Delivery" />
                <IconFeature
                  icon={<FaMoneyBillAlt />}
                  text="Cash on Delivery"
                />
                <IconFeature icon={<FaUndo />} text="7 Days Return" />
                <IconFeature icon={<FaBusinessTime />} text="Quick Dispatch" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row  mt-8">
          <div className="lg:w-2/3">
            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Description"
                isOpen={showDescription}
                toggle={() => setShowDescription(!showDescription)}
              >
                <ul className="text-gray-700 text-sm list-disc list-inside">
                  {activeProduct.description.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </CollapsibleSection>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Dimensions & Material"
                isOpen={showDimensions}
                toggle={() => setShowDimensions(!showDimensions)}
              >
                <p className="text-gray-700 text-sm ">
                  Dimensions: {activeProduct.dimensions}
                </p>
                <p className="text-gray-700 text-sm">
                  Material: {activeProduct.material}
                </p>
              </CollapsibleSection>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Care Instructions"
                isOpen={showCareInstructions}
                toggle={() => setShowCareInstructions(!showCareInstructions)}
              >
                <p className="text-gray-700 text-sm">Clean with a dry cloth.</p>
              </CollapsibleSection>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-1 mb-4">
              <CollapsibleSection
                title="Shipping & Returns"
                isOpen={showShipping}
                toggle={() => setShowShipping(!showShipping)}
              >
                <p className="text-gray-700 text-sm">
                  Free shipping available. Returns accepted within 7 days.
                </p>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({ title, isOpen, toggle, children }) => (
  <div className="my-4">
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={toggle}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <FaChevronDown className={isOpen ? "transform rotate-180" : ""} />
    </div>
    {isOpen && <div className="mt-2">{children}</div>}
  </div>
);

// IconFeature Component
const IconFeature = ({ icon, text }) => (
  <div className="flex flex-col items-center p-0 m-0 space-y-1">
    {" "}
    {/* Space between icon and text */}
    <div className="text-xl">{icon}</div>
    <span className="text-sm text-gray-700">{text}</span>
  </div>
);


export default WoodenProductDesc;
