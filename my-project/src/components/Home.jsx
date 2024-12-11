import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/images");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleImageClick = async (imageId) => {
    try {
      const response = await axios.get(`http://localhost:5000/getobjectid/${imageId}`, { withCredentials: true });
      const objectId = response.data.objectId;
      navigate(`/image/${objectId}`);

    } catch (error) {
      console.error("Error in handleImageClick:", error);
    }
  };

  const handlesaveclick = async (imageId) => {
    console.log("frontend",imageId)
    try {
      const response = await axios.post(`http://localhost:5001/handleuploadsave/${imageId}`,{}, { withCredentials: true });
    } catch (error) {
      console.log("error in catch of handlesaveclick frontend", error);
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="columns-1 md:columns-2 lg:columns-5 gap-4 p-5">
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
                    className="absolute top-4 right-1 bg-red-600 rounded-[25px] text-white px-5 py-3 opacity-0 group-hover:opacity-100 hover:text-black font-sans cursor-pointer"
                    onClick={() => handlesaveclick(pin._id)}>
                    Save
                  </button>
                </>
              )}
              <h1 className="text-base font-semibold mt-2">{pin.title}</h1>
              <p>{pin.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
