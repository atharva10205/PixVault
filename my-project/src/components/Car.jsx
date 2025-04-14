import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Car = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchcarimages = async () => {
      try {
        const response = await axios.get(
          "https://pixvault.onrender.com/fetchcarimages"
        );
        //f h
        setImages(response.data);
      } catch (error) {
        console.log("Error in frontend fetchcarimages", error);
      }
    };
    fetchcarimages();
  }, []);

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
  const handlesaveclick = (e) => {
    e.stopPropagation();
    console.log("Image saved!");
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center">
        <div className="relative w-[450px] h-[450px] m-2 cursor-pointer rounded-lg shadow-lg">
          <img
            src="https://i.pinimg.com/474x/13/8f/06/138f0675237eec3563d1475ec63f7262.jpg"
            className="w-[450px] h-[450px] object-cover rounded-[50px]"
          />
          <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
          <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 font-semibold text-[30px]">
            Cars
          </div>
        </div>
      </div>

      <div className="columns-2 md:columns-2 lg:columns-5 gap-4 p-5">
        {images.length > 0 ? (
          images.map((pin, index) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <div className="block relative group">
                {pin.imageUrl && (
                  <>
                    <img
                      className="rounded-xl w-full object-cover cursor-pointer group-hover:brightness-75 transition duration-200"
                      src={pin.imageUrl}
                      alt={pin.title || "Image"}
                      onClick={() => handleImageClick(pin._id)}
                    />
                    <button
                      className="absolute top-4 right-1 bg-yellow-400 rounded-[25px] text-white px-5 py-3 opacity-0 group-hover:opacity-100 hover:text-black font-sans cursor-pointer"
                      onClick={handlesaveclick}
                    >
                      Save
                    </button>
                  </>
                )}
                <h1 className="text-base font-semibold text-white mt-2">
                  {pin.title || ""}
                </h1>{" "}
                <p className="text-white">{pin.description || ""}</p>{" "}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No images found</p>
        )}
      </div>
    </div>
  );
};

export default Car;
