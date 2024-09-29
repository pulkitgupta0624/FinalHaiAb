import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const token = userInfo.token;
        const { data } = await axios.get(
          `https://qdore-backend-final-final-last.vercel.app/api/orders/${orderId}/track`, // Fetch tracking information
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Tracking Info:", data); // Log the response to verify the structure
        setTrackingInfo(data);
      } catch (error) {
        setError("Error fetching tracking information");
        console.error("Error fetching tracking information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Default empty array if trackingInfo or history is undefined
  const trackingHistory = trackingInfo?.history || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
          Track Your Order
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
            Order #{orderId}
          </h2>
          {trackingInfo ? (
            <div>
              <p className="text-gray-600 mb-4">
                Status: {trackingInfo.status}
              </p>
              <p className="text-gray-600 mb-4">
                Estimated Delivery: {trackingInfo.estimatedDelivery}
              </p>
              <h3 className="text-xl font-semibold mb-4">Tracking History</h3>
              <ul>
                {trackingHistory.map((entry, index) => (
                  <li key={index} className="mb-4">
                    <div className="bg-gray-100 p-4 rounded-md shadow-md">
                      <p className="font-semibold">{entry.location}</p>
                      <p>{entry.timestamp}</p>
                      <p>{entry.details}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No tracking information available.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;
