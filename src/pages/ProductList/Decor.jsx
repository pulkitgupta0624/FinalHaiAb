import React, { useEffect } from "react";
import { FaArrowRight, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import image11 from "../../assets/CandleHolders/ch1.jpg";
import image22 from "../../assets/CandleHolders/ch2.jpg";
import image33 from "../../assets/CandleHolders/ch3.jpg";
import image44 from "../../assets/CandleHolders/ch4.jpg";
import image55 from "../../assets/CandleHolders/ch5.jpg";
import image66 from "../../assets/CandleHolders/ch6.jpg";
import image77 from "../../assets/CandleHolders/ch7.jpg";
import image1 from "../../assets/objectDecor/gb.png";

import AOS from "aos";
import "aos/dist/aos.css";

const CandleHolder = () => {
  const products = [
    { id: "classical-starburst-lanterns", name: "THE CLASSICAL STARBURST LANTERNS", image: image11, originalPrice: 3200, discountedPrice: 250 },
    { id: "starburst-lanterns", name: "STARBURST LANTERNS", image: image22, originalPrice: 5000, discountedPrice: 250 },
    { id: "solar-candle-holders", name: "SOLAR CANDLE HOLDERS", image: image33, originalPrice: 4500, discountedPrice: 250 },
    { id: "solar-candle-hurricanes", name: "SOLAR CANDLE HURRICANES", image: image44, originalPrice: 4500, discountedPrice: 250 },
    { id: "acacia-wood-candle-holders", name: "ACACIA WOOD CANDLE HOLDERS", image: image55, originalPrice: 3200, discountedPrice: 250 },
    { id: "eris-marble-candle-holders", name: "ERIS MARBLE CANDLE HOLDERS", image: image66, originalPrice: 2500, discountedPrice: 250 },
    { id: "psyche-candle-holders", name: "PSYCHE CANDLE HOLDERS", image: image77, originalPrice: 5000, discountedPrice: 250 },
    { id: "the-globe", name: "THE GLOBE", image: image1, originalPrice: 1400, discountedPrice: 250 },

  ];

  const navigate = useNavigate();

  const handleNavigation = (product) => {
    if (product.id.includes("candle") || product.id.includes("lanterns")) {
      navigate(`/decor/candleDecor/${product.id}`);
    } else if (product.id.includes("globe")) {
      navigate(`/decor/objectDecor/${product.id}`);
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
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-5 py-10">
        {/* Adjusted grid to 4 columns for large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between"
              data-aos="fade-up"
            >
              <img
                src={product.image}
                onClick={() => handleNavigation(product)}
                alt={product.name}
                className="w-full h-65 object-cover transition-opacity duration-300 hover:opacity-80 cursor-pointer"
              />
              <div className="p-4 flex flex-col justify-between h-full">
                <h2 className="text-2xl text-center font-semibold mb-2">{product.name}</h2>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-black">₹{product.originalPrice}</span>

                  </div>
                  <FaTag className="text-gray-400" />
                </div>
                {/* Buttons for Checkout and Add to Cart */}
                <div className="mt-4 flex justify-between gap-4">
                  <button
                    onClick={() => handleNavigation(product)}
                    className="bg-black w-1/2 text-white text-xl px-5 py-2 rounded transition-transform duration-300 hover:scale-105"
                  >
                    Buy Now
                  </button>
                  <button
                    className="bg-black w-1/2 text-white text-xl px-5 py-2 rounded transition-transform duration-300 hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CandleHolder;
