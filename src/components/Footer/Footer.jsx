import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedin, FaAmazon, FaPhoneAlt, FaMapMarkerAlt, FaEnvelopeSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logoImp2.png";

const Footer = () => {
  const [isOpen, setIsOpen] = useState({
    categories: false,
    bestsellers: false,
    aboutUs: false,
    help: false,
  });

  const navigate = useNavigate();

  const toggleSection = (section) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <footer className="bg-black text-white py-10 px-5">
      <div className="w-full max-w-none mx-0 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Logo Centered */}
        <div className="col-span-1 flex justify-center items-center">
          <img src={logo} alt="Company Logo" className="w-60" />
        </div>

        {/* Contact Us Section */}
        <div className="col-span-1">
          <p className="mb-2 font-bold text-xl">Contact Us</p>
          <div className="flex space-x-4 mb-5 mt-5">
            {/* Social Media Icons */}
            <div className="relative group">
              <a href="https://www.facebook.com/profile.php?id=61560626668033&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="hover:text-gray-400 cursor-pointer" />
              </a>
              <span className="absolute left-0 bottom-6 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Facebook</span>
            </div>
            <div className="relative group">
              <a href="https://www.instagram.com/qdorehome?igsh=M21uZ3hhb251a2c2" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="hover:text-gray-400 cursor-pointer" />
              </a>
              <span className="absolute left-0 bottom-6 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Instagram</span>
            </div>
            <div className="relative group">
              <a href="https://www.linkedin.com/company/qdore-home/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="hover:text-gray-400 cursor-pointer" />
              </a>
              <span className="absolute left-0 bottom-6 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">LinkedIn</span>
            </div>
            <div className="relative group">
              <a href="https://www.amazon.in/dp/B0DDC5HDTD" target="_blank" rel="noopener noreferrer">
                <FaAmazon className="hover:text-gray-400 cursor-pointer" />
              </a>
              <span className="absolute left-0 bottom-6 text-xs bg-gray-700 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Amazon</span>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <FaPhoneAlt className="mr-2" />
            <p className="text-sm">+91 7983131615</p>
          </div>
          <div className="flex items-center mt-5">
            <FaEnvelopeSquare className="mr-2" />
            <p className="text-sm">admin@qdorehome.com</p>
          </div>
          <div className="flex items-center mt-5">
            <FaMapMarkerAlt className="mr-2" />
            <p className="text-sm">Qdore Home <br /> Quality Collection Inc <br /> Lakri Fazalpur, Delhi Road <br /> Moradabad (UP) 244001, India</p>
          </div>
        </div>

        {/* Top Categories and Bestsellers */}
        <div className="col-span-1">
          <h4 className="font-bold text-xl mb-2">Top Categories</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer" onClick={() => navigate('/furniture')}>Furniture</li>
            <li className="cursor-pointer" onClick={() => navigate('/decor')}>Decor</li>
            <li className="cursor-pointer" onClick={() => navigate('/servewares')}>Servewares</li>
            <li className="cursor-pointer" onClick={() => navigate('/plantersandvases')}>Planters & Vases</li>
          </ul>
          <h4 className="font-bold text-xl mt-6 mb-2">Bestsellers</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer" onClick={() => navigate('/woodenCollection')}>Wooden Collection</li>
            <li className="cursor-pointer" onClick={() => navigate('/mercuryCollection')}>Mercury Collection</li>
          </ul>
        </div>

        {/* About Us Section */}
        <div className="col-span-1">
          <h4 className="font-bold text-xl mb-2">About Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer" onClick={() => navigate('/contactUs')}>Contact Us</li>
            <li className="cursor-pointer" onClick={() => navigate('/ourStory')}>Our Story</li>
            <li className="cursor-pointer" onClick={() => navigate('/b2b')}>Collaborate With Us</li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="col-span-1">
          <h4 className="font-bold text-xl mb-2">Help</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer" onClick={() => navigate('/auth')}>Login/Register</li>
            <li className="cursor-pointer" onClick={() => navigate('/profile')}>Profile</li>
            <li className="cursor-pointer" onClick={() => navigate('/termsandconditions')}>Terms & Conditions</li>
            <li className="cursor-pointer" onClick={() => navigate('/privacypolicy')}>Privacy Policy</li>
            <li className="cursor-pointer" onClick={() => navigate('/shippingpolicy')}>Shipping Policy</li>
            <li className="cursor-pointer" onClick={() => navigate('/returnpolicy')}>Return Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
