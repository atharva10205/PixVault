import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Natuer = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNatuerimages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/fetchNatuerimages"
        );
        setImages(response.data);
      } catch (error) {
        console.log("Error in frontend fetchNatuerimages", error);
      }
    };
    fetchNatuerimages();
  }, []);

  const handleImageClick = async (imageId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getobjectid/${imageId}`,
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
    <div>
      <Navbar />

      <div className="flex items-center justify-center">
      <div className="relative w-[450px] h-[450px] m-2 cursor-pointer rounded-lg shadow-[30px]">
            <img src="https://i.pinimg.com/736x/6c/10/05/6c10057c665df96576122553ffa114ed.jpg"
              className="w-[450px] h-[450px] object-cover rounded-[50px]" />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[30px]">
              Nature
            </div>
          </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-5 gap-4 p-5">
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
                      className="absolute top-4 right-1 bg-red-600 rounded-[25px] text-white px-5 py-3 opacity-0 group-hover:opacity-100 hover:text-black font-sans cursor-pointer"
                      onClick={handlesaveclick}
                    >
                      Save
                    </button>
                  </>
                )}
                <h1 className="text-base font-semibold mt-2">
                  {pin.title || ""}
                </h1>{" "}
                <p>{pin.description || ""}</p>{" "}
              </div>
            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
    </div>
  );
};

export default Natuer;
