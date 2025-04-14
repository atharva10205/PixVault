import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Searchedimages = () => {
  const { input } = useParams();
  const [searchedimages, setsearchedimages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchsearchedimages = async () => {
      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/search/${input}`,
          { withCredentials: true }
        );
        setsearchedimages(response.data);
      } catch (error) {
        console.log("Error in frontend fetchsearchedimages", error);
      }
    };
    fetchsearchedimages();
  }, [input]);

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

  const navigatetoaccounts = () => {
    navigate(`/Account/${input}`);
  };

  return (
    <div className="bg-black min-h-screen">
    <Navbar />
  
    <div className="text-white flex  sm:flex-row items-center justify-center gap-7 sm:gap-10 pt-4">
      <div className="cursor-pointer underline decoration-[3px] decoration-yellow-400">
        Media
      </div>
  
      <div
        onClick={navigatetoaccounts}
        className="cursor-pointer hover:underline decoration-[3px] decoration-yellow-400"
      >
        Accounts
      </div>
    </div>
  
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 px-4 py-6">
      {searchedimages.length > 0 ? (
        searchedimages.map((image, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <div className="block relative group">
              {image.imageUrl && (
                <>
                  <img
                    className="rounded-xl w-full object-cover cursor-pointer group-hover:brightness-75 transition duration-200"
                    src={image.imageUrl}
                    alt={image.title || "Image"}
                    onClick={() => handleImageClick(image._id)}
                  />
                  <button className="absolute p-2 top-3 right-3 bg-yellow-400 rounded-full text-white text-sm sm:text-base px-4 sm:px-5 py-2 sm:py-3 opacity-0 group-hover:opacity-100 hover:text-black font-sans cursor-pointer">
                    Save
                  </button>
                </>
              )}
              {image.title && (
                <h1 className="text-sm sm:text-base font-semibold mt-2 text-white">{image.title}</h1>
              )}
              {image.description && <p className="text-xs sm:text-sm text-gray-300">{image.description}</p>}
            </div>
          </div>
        ))
      ) : (
        <div className="text-white text-center mt-20 text-lg sm:text-xl font-semibold">
          No images found.
        </div>
      )}
    </div>
  </div>
  )  
};

export default Searchedimages;
