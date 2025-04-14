import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const limit = 22;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchImages = async () => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/images?page=${page}&limit=${limit}`
        );

        let newImages = response.data.images;
        newImages = shuffleArray(newImages); // Shuffle before displaying

        setImages((prev) => [...prev, ...newImages]); // Update images
        setHasMore(response.data.check_if_more_images); // Check if more images exist
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page]);

  // Handle image click
  const handleImageClick = async (imageId) => {
    try {
      const response = await axios.get(
        `https://pixvault.onrender.com/getobjectid/${imageId}`,
        { withCredentials: true }
      );
      const objectId = response.data.objectId;
      navigate(`/image/${objectId}`);
    } catch (error) {
      console.error("Error in handleImageClick:", error);
    }
  };

  // Handle save click
  const handleSaveClick = async (imageId) => {
    try {
      await axios.post(
        `https://pixvault.onrender.com/handleuploadsave/${imageId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Error saving image:", error);
    }
  };

  return (
    <div className="relative bg-black min-h-screen">
      <Navbar />
  
     
      {/* Pinterest-like Responsive Grid */}
      {!loading && (
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 px-2 sm:px-4 py-5">
          {images.map((pin, index) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <div className="block relative group">
                {pin.imageUrl && (
                  <>
                    <img
                      className="rounded-xl w-full object-cover cursor-pointer group-hover:brightness-75 transition duration-200"
                      src={pin.imageUrl}
                      alt={pin.title}
                      onClick={() => handleImageClick(pin._id)}
                    />
                    <button
                      className="absolute top-3 right-2 bg-yellow-400 rounded-full text-white px-4 py-2 opacity-0 group-hover:opacity-100 hover:text-black hover:bg-yellow-500 transition duration-200 cursor-pointer text-sm"
                      onClick={() => handleSaveClick(pin._id)}
                    >
                      Save
                    </button>
                  </>
                )}
                <h1 className="text-white text-sm font-semibold mt-2 truncate">
                  {pin.title}
                </h1>
                <p className="text-gray-400 text-xs truncate">{pin.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* End of List Message */}
      {!hasMore && (
        <div className="text-center text-yellow-400 bg-black py-4 px-2">
          <p>You reached the bottom</p>
          <div className="mt-2 text-lg font-bold text-green-600">
            Touch some Grass <span className="text-2xl">🌱</span>
          </div>
        </div>
      )}
  
      {/* Floating Chat Button */}
      <div className="fixed md:bottom-4 bottom-20 right-4 sm:right-6">
        <button
          className="bg-black rounded-full p-2 shadow-lg hover:bg-yellow-300 transition duration-200"
          onClick={() => navigate("/chatlist")}
        >
          <img
            src="https://i.pinimg.com/736x/6e/64/85/6e6485016e5523a7fb9989880ce7deb3.jpg"
            alt="Message Logo"
            className="h-14 w-14 sm:h-16 sm:w-16 p-[10px] rounded-full bg-black object-contain"
          />
        </button>
      </div>
    </div>
  );
  
};

export default Home;
