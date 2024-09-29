import React, { useEffect } from "react";
import { FaArrowRight, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import image1 from "../../assets/sidetables/side2.jpg";
import image2 from "../../assets/sidetables/side5.jpg";
import image3 from "../../assets/sidetables/side1.jpg";
import image4 from "../../assets/sidetables/side3.jpg";
import image5 from "../../assets/sidetables/side4.jpg";
import image6 from "../../assets/sidetables/side6.jpg";

import AOS from "aos";
import "aos/dist/aos.css";

const SideTable = () => {
    const products = [
        { id: "virgo-side-table", name: "VIRGO SIDE TABLE", image: image1, originalPrice: 9500, discountedPrice: 250 },
        { id: "orbit-side-table", name: "ORBIT SIDE TABLE", image: image2, originalPrice: 7700, discountedPrice: 250 },
        { id: "pluto-side-table", name: "PLUTO SIDE TABLE", image: image3, originalPrice: 9500, discountedPrice: 250 },
        { id: "vega-side-table", name: "VEGA SIDE TABLE", image: image4, originalPrice: 9500, discountedPrice: 250 },
        { id: "acacia-wood-side-table", name: "ACACIA WOOD SIDE TABLE", image: image5, originalPrice: 9500, discountedPrice: 250 },
        { id: "the-cosmic-mirror-side-table", name: "THE COSMIC MIRROR SIDE TABLE", image: image6, originalPrice: 25000, discountedPrice: 250 },   
    ];

    const navigate = useNavigate();

    const handleNavigation = (product) => {
      navigate(`/furniture/side-table/${product.id}`);
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

export default SideTable;
