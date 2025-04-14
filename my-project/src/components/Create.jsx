import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Create = ({ onCreatePin }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handelimagechange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store the actual file instead of the URL
    }
  };

  const handelinputarea = () => {
    document.getElementById("imageUpload").click();
  };

  const handleSubmit = async () => {
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("image", image); // Now sending the actual file

    try {
      const response = await axios.post(
        "https://pixvault.onrender.com/upload",
        formdata,
        { withCredentials: true }
      );
      console.log(response);
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center bg-black justify-center h-screen relative">
          <button
            onClick={() => navigate("/Home")}
            className="absolute top-4 right-4 text-black text-[30px] p-2 rounded-full text-sm font-bold"
          >
            X
          </button>

          <h1 className="text-xl text-slate-400 font-bold">
            You need to sign in to upload posts
          </h1>

          <button
            onClick={() => navigate("/signup")}
            className="mt-4 bg-yellow-400 p-4 rounded-[20px] text-black font-bold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="px-4 sm:px-24">
        <h1 className="font-bold text-white text-xl my-10">Create Post</h1>

        <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
          {/* Upload Box */}
          <div
            onClick={handelinputarea}
            className="w-full sm:w-80 h-72 bg-zinc-800 rounded-[30px] cursor-pointer flex items-center justify-center"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="h-full w-full object-cover rounded-[30px]"
              />
            ) : (
              <span className="text-yellow-400 text-lg font-semibold">
                Upload
              </span>
            )}
            <input
              type="file"
              id="imageUpload"
              onChange={handelimagechange}
              style={{ display: "none" }}
              required
            />
          </div>

          {/* Input Fields */}
          <div className="w-full sm:max-w-md">
            <h1 className="text-yellow-400 mb-2">Title</h1>
            <input
              value={title}
              onChange={handleTitleChange}
              className="bg-zinc-800 w-full h-10 p-2 text-white placeholder-gray-400 rounded-[10px]"
              type="text"
              placeholder="Add a Title"
            />

            <div className="mt-6">
              <h1 className="text-yellow-400 mb-2">Description</h1>
              <input
                value={description}
                onChange={handleDescriptionChange}
                className="bg-zinc-800 w-full h-10 text-white p-2 placeholder-gray-400 rounded-[10px]"
                type="text"
                placeholder="Add the Description"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-7 mb-5 sm:w-[100px] bg-yellow-400 text-black w-full py-3 rounded-[25px] font-bold"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
