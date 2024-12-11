import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Searchedimages = () => {
  const { input } = useParams();
  const [searchedimages, setsearchedimages] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchsearchedimages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/search/${input}`,
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
      const response = await axios.get(`http://localhost:5000/getobjectid/${imageId}`, { withCredentials: true });
      const objectId = response.data.objectId;
      navigate(`/image/${objectId}`);

    } catch (error) {
      console.error("Error in handleImageClick:", error);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="columns-1 md:columns-2 lg:columns-5 gap-4 p-5">
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
                    <button className="absolute p-4 top-4 right-1 bg-red-600 rounded-[25px] text-white px-5 py-3 opacity-0 group-hover:opacity-100 hover:text-black font-sans cursor-pointer">
                      Save
                    </button>
                  </>
                )}

                {image.title && (
                  <h1 className="text-base font-semibold mt-2">{image.title}</h1>
                )}

                {image.description && (
                  <p>{image.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
};

export default Searchedimages;
