import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Created = () => {
  const css = "rounded-xl w-full object-cover";
  const [createdImages, setCreatedImages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifytoken = async () => {
      const response = await axios.post(
        "https://pixvault.onrender.com/verify",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    verifytoken();
  }, []);

  const handleDeleteimage = async (imageId) => {
    setCreatedImages((prevImages) =>
      prevImages.filter((image) => image._id !== imageId)
    );

    try {
      const response = await axios.delete(
        `https://pixvault.onrender.com/delete/${imageId}`,
        { withCredentials: true }
      );

      console.log(response.data.message);
    } catch (error) {
      console.log("error in frontend const handleDeleteimage", error);
    }
  };

  const fetchCreatedImages = async () => {
    try {
      const response = await axios.get("https://pixvault.onrender.com/created", {
        withCredentials: true,
      });
      setCreatedImages(response.data);
    } catch (error) {
      console.log("Error in fetching URL from created:", error.message);
    }
  };

  const handlesigninbutton = () => {
    navigate("/signup");
  };

  useEffect(() => {
    fetchCreatedImages();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="bg-black">
        <Profile />
        <hr className="border-t bg-black border-gray-300 w-full" />

        <div className="flex flex-col text-white items-center justify-center mt-10 font-bold font-sans">
          You need to signin before creating
          <button
            className="bg-yellow-400 text-black p-3 rounded-[30px] mt-6"
            onClick={handlesigninbutton}
          >
            signup
          </button>
        </div>
      </div>
    );
  }

  return (
    
    <div className="bg-black">
      <Profile />

      <div className="columns-2 bg-black md:columns-2 lg:columns-5 gap-4 p-5">
        {createdImages.map((image, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <div className="block">
              <div className="relative group">
                <img
                  className={`${css} cursor-pointer group-hover:brightness-75 transition duration-200`}
                  src={image.imageUrl} // Corrected key for image URL
                  alt={image.title || "Uploaded Image"}
                />
                <button
                  onClick={() => handleDeleteimage(image._id)}
                  className="absolute top-4 right-1 bg-yellow-400 rounded-[25px] text-white px-5 py-3 opacity-0 group-hover:opacity-100 hover:text-black font-sans cursor-pointer"
                >
                  Delete
                </button>
              </div>
              <h1 className="text-base font-semibold mt-2">{image.title}</h1>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Created;
