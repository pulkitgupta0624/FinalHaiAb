import React, { useEffect } from "react";
import { FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import imageM1 from '../../assets/Mercury/mc11.jpg';
import imageM2 from '../../assets/Mercury/mc22.jpg';

import AOS from "aos";
import "aos/dist/aos.css";

const PlantersAndVases = () => {
    const products = [
        { id: "mercury-planter-planter", name: "MERCURY PLANTER", image: imageM1, originalPrice: 5000, discountedPrice: 250 },
        { id: "mercury-cone-vase", name: "MERCURY VASE", image: imageM2, originalPrice: 3200, discountedPrice: 250 }
    ];

    const navigate = useNavigate();

    const handleNavigation = (product) => {
        console.log("Navigating to:", product.id);
        navigate(`/plantersandvases/${product.id}`);
    };

    useEffect(() => {
        console.log("Products:", products);
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

export default PlantersAndVases;
