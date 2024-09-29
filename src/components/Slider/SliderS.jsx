import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "./slider.css";

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";

import image1 from '../../assets/Lifestyle/ClassicStarbust/classicStarbust2.jpeg';
import image2 from '../../assets/CandleHolders/ch2.jpg';
import image3 from '../../assets/CandleHolders/ch3.jpg';
import image4 from '../../assets/CandleHolders/ch4.jpg';
import image5 from '../../assets/CandleHolders/ch5.jpg';
import image6 from '../../assets/CandleHolders/ch6.jpg';
import image7 from '../../assets/CandleHolders/ch7.jpg';

const products = [
  {
    id: "classical-starburst-lanterns",
    heading: "THE CLASSICAL STARBURST LANTERNS",
    image: image1,
    price: "99.99",
  },
  {
    id: "starburst-lanterns",
    heading: "STARBURST LANTERNS",
    image: image2,
    price: "89.99",
  },
  {
    id: "solar-candle-holders",
    heading: "SOLAR CANDLE HOLDERS",
    image: image3,
    price: "79.99",
  },
  {
    id: "solar-candle-hurricanes",
    heading: "SOLAR CANDLE HURRICANES",
    image: image4,
    price: "119.99",
  },
  {
    id: "acacia-wood-candle-holders",
    heading: "ACACIA WOOD CANDLE HOLDERS",
    image: image5,
    price: "69.99",
  },
  {
    id: "eris-marble-candle-holders",
    heading: "ERIS MARBLE CANDLE HOLDERS",
    image: image6,
    price: "69.99",
  },
  {
    id: "psyche-candle-holders",
    heading: "PSYCHE CANDLE HOLDERS",
    image: image7,
    price: "69.99",
  }
];

const SliderS = () => {
  const navigate = useNavigate();

  // Navigate to product detail page on image click
  const handleClick = (id) => {
    navigate(`/decor/candleDecor/${id}`);
  };

  return (
    <div className="container">
      <style>
        {`
          .gradient-text {
            background: linear-gradient(0deg, #7D3E00 -7.62%, #FFC170 14.51%, #FFEED8 32.4%, #FFC170 84.95%, #7D3E00 106.96%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .slider-arrow {
            position: absolute;
            top: 50%;
            z-index: 10;
            color: white;
            padding: 10px;
            cursor: pointer;
            transform: translateY(-50%);
          }
          .slider-arrow-left {
            left: 5px;
          }
          .slider-arrow-right {
            right: 5px;
          }
          .swiper-pagination-bullet {
            background: #7D3E00;
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: #FFC170;
          }
        `}
      </style>

      <h1 className="text-7xl mt-20 text-center font-futura font-thin">HOME DECOR</h1>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ clickable: true }} // Enables clickable pagination dots
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} onClick={() => handleClick(product.id)} className="cursor-pointer">
            <img src={product.image} alt={product.heading} />
          </SwiperSlide>
        ))}

        {/* Custom left and right arrows */}
        <div className="swiper-button-prev slider-arrow slider-arrow-left">
          <IoIosArrowDropleftCircle size={20} />
        </div>
        <div className="swiper-button-next slider-arrow slider-arrow-right">
          <IoIosArrowDroprightCircle size={20} />
        </div>
      </Swiper>
    </div>
  );
};

export default SliderS;
