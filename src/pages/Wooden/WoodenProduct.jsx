import React, { useEffect } from "react";
import { FaArrowRight, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import imageW1 from '../../assets/wooden/w1.jpg';
import imageW2 from '../../assets/wooden/w2.jpg';
import imageW3 from '../../assets/wooden/w3.jpg';
import imageW4 from '../../assets/wooden/w4.jpg';
import imageW5 from '../../assets/wooden/w5.jpg';
import imageW6 from '../../assets/wooden/w6.jpg';

import AOS from "aos";
import "aos/dist/aos.css";

const WoodenCollection = () => {
    const products = [
      { id: "acacia-wood-candle-holder", name: "ACACIA WOOD CANDLE HOLDER", image: imageW1, originalPrice: 3200, discountedPrice: 250 },
      { id: "acacia-wood-side-table", name: "ACACIA WOOD SIDE TABLE", image: imageW2, originalPrice: 9500, discountedPrice: 250 },
      { id: "acacia-wood-bowl-i", name: "ACACIA WOOD BOWL-I", image: imageW3, originalPrice: 1400, discountedPrice: 250 },
      { id: "acacia-circular-wood-bowl-and-spoon-set", name: "ACACIA CIRCULAR WOOD BOWL & SPOON SET", image: imageW4, originalPrice: 550, discountedPrice: 250 },
      { id: "acacia-wood-bowl-and-serve-set", name: "ACACIA WOOD BOWL & SERVE SET", image: imageW5, originalPrice: 2300, discountedPrice: 250 },
      { id: "acacia-wood-bowl-ii", name: "ACACIA WOOD BOWL-II", image: imageW6, originalPrice: 1400, discountedPrice: 250 }   
    ];

    const navigate = useNavigate();

    const handleNavigation = (product) => {
      navigate(`/woodenCollection/${product.id}`);
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
                                        <span className="text-black font-semibold">₹{product.originalPrice}</span>
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

export default WoodenCollection;
