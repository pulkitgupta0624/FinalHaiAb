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
import image11 from "../../assets/Lifestyle/ClassicStarbust/classicStarbust2.jpeg";
import image22 from "../../assets/CandleHolders/ch2.jpg";
import image33 from "../../assets/CandleHolders/ch3.jpg";
import image44 from "../../assets/CandleHolders/ch4.jpg";
import image55 from "../../assets/CandleHolders/ch5.jpg";
import image66 from "../../assets/CandleHolders/ch6.jpg";
import image77 from "../../assets/CandleHolders/ch7.jpg";
import globe from "../../assets/objectDecor/globe.jpg";
import imageM1 from '../../assets/Lifestyle/MercuryPlanter/mplanter.png';
import imageM2 from '../../assets/Lifestyle/MercuryCone/mcone1.jpeg';
import imageW1 from '../../assets/wooden/w1.jpg';
import imageW2 from '../../assets/wooden/w2.jpg';
import imageW3 from '../../assets/wooden/w3.jpg';
import imageW4 from '../../assets/wooden/w4.jpg';
import imageW5 from '../../assets/wooden/w5.jpg';
import imageW6 from '../../assets/wooden/w6.jpg';
import s12 from "../../assets/Serveware/s12.jpg";
import s21 from "../../assets/Serveware/s21.jpg";
import s34 from "../../assets/Serveware/s34.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

export const ShopAll = () => {
    const products = [
        { id: "virgo-side-table", name: "VIRGO SIDE TABLE", image: image1, originalPrice: 9500, discountedPrice: 250 },
        { id: "orbit-side-table", name: "ORBIT SIDE TABLE", image: image2, originalPrice: 7700, discountedPrice: 250 },
        { id: "pluto-side-table", name: "PLUTO SIDE TABLE", image: image3, originalPrice: 9500, discountedPrice: 250 },
        { id: "vega-side-table", name: "VEGA SIDE TABLE", image: image4, originalPrice: 9500, discountedPrice: 250 },
        { id: "acacia-wood-side-table", name: "ACACIA WOOD SIDE TABLE", image: image5, originalPrice: 9500, discountedPrice: 250 },
        { id: "the-cosmic-mirror-side-table", name: "THE COSMIC MIRROR SIDE TABLE", image: image6, originalPrice: 25000, discountedPrice: 250 },
        { id: "classical-starburst-lanterns", name: "THE CLASSICAL STARBURST LANTERNS", image: image11, originalPrice: 3200, discountedPrice: 250 },
        { id: "starburst-lanterns", name: "STARBURST LANTERNS", image: image22, originalPrice: 5000, discountedPrice: 250 },
        { id: "solar-candle-holders", name: "SOLAR CANDLE HOLDERS", image: image33, originalPrice: 4500, discountedPrice: 250 },
        { id: "solar-candle-hurricanes", name: "SOLAR CANDLE HURRICANES", image: image44, originalPrice: 4500, discountedPrice: 250 },
        { id: "acacia-wood-candle-holders", name: "ACACIA WOOD CANDLE HOLDERS", image: image55, originalPrice: 3200, discountedPrice: 250 },
        { id: "eris-marble-candle-holders", name: "ERIS MARBLE CANDLE HOLDERS", image: image66, originalPrice: 2500, discountedPrice: 250 },
        { id: "psyche-candle-holders", name: "PSYCHE CANDLE HOLDERS", image: image77, originalPrice: 5000, discountedPrice: 250 },
        { id: "the-globe", name: "THE GLOBE", image: globe, originalPrice: 1400, discountedPrice: 250 },
        { id: "mercury-planter", name: "MERCURY PLANTER", image: imageM1, originalPrice: 5000, discountedPrice: 250 },
        { id: "mercury-cone", name: "MERCURY CONE", image: imageM2, originalPrice: 3200, discountedPrice: 250 },
        { id: "acacia-wood-candle-holder", name: "ACACIA WOOD CANDLE HOLDER", image: imageW1, originalPrice: 3200, discountedPrice: 250 },
        { id: "acacia-wood-table-wooden", name: "ACACIA WOOD SIDE TABLE", image: imageW2, originalPrice: 9500, discountedPrice: 250 },
        { id: "acacia-wood-bowl-i", name: "ACACIA WOOD BOWL-I", image: imageW3, originalPrice: 1400, discountedPrice: 250 },
        { id: "acacia-circular-wood-bowl-and-spoon-set", name: "ACACIA CIRCULAR WOOD BOWL & SPOON SET", image: imageW4, originalPrice: 550, discountedPrice: 250 },
        { id: "acacia-wood-bowl-and-serve-set", name: "ACACIA WOOD BOWL & SERVE SET", image: imageW5, originalPrice: 2300, discountedPrice: 250 },
        { id: "acacia-wood-bowl-ii", name: "ACACIA WOOD BOWL-II", image: imageW6, originalPrice: 1400, discountedPrice: 250 },
        { id: "acacia-wood-bowl-serveware", name: "ACACIA WOOD BOWL", image: s12, originalPrice: 950, discountedPrice: 250 },
        { id: "chopping-board-serveware", name: "CHOPPING BOARD", image: s21, originalPrice: 3600, discountedPrice: 250 },
        { id: "cake-dome-serveware", name: "CAKE DOME", image: s34, originalPrice: 4500, discountedPrice: 250 }
    ];

    const navigate = useNavigate();

    const handleNavigation = (product) => {
        if (product.id.includes("side")) {
            navigate(`/furniture/side-table/${product.id}`);
        } else if (product.id.includes("candle") || product.id.includes("lanterns")) {
            navigate(`/decor/candleDecor/${product.id}`);
        } else if (product.id.includes("mercury")) {
            navigate(`/mercuryCollection/${product.id}`);
        } else if (product.id.includes("globe")) {
            navigate(`/decor/objectDecor/${product.id}`);
        } else if (product.id.includes("serveware")) {
            navigate(`/servewares/${product.id}`);
        } else {
            navigate(`/woodenCollection/${product.id}`);
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
                                <h2 className="text-xl text-center font-semibold mb-2">{product.name}</h2>
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
                                        className="bg-black w-1/2 text-white text-xl sm:text-sm px-5 py-2 rounded transition-transform duration-300 hover:scale-105"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        className="bg-black w-1/2 text-white text-xl sm:text-sm px-5 py-2 rounded transition-transform duration-300 hover:scale-105"
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

export default ShopAll;
