import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Create = ({onCreatePin  }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const verifytoken = async()=>{

      const response = await axios.post("http://localhost:5000/verify",{},{withCredentials:true});
      if(response.status === 200){setIsAuthenticated(true)}else{setIsAuthenticated(false)};
    }
    verifytoken();
  }, [])


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
      const response = await axios.post("http://localhost:5000/upload", formdata, {withCredentials: true,});
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
      <div className="flex flex-col items-center justify-center h-screen relative">
  {/* Close Button */}
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
    className="mt-4 bg-red-500 p-4 rounded-[20px] text-white font-bold"
  >
    Sign In
  </button>
</div>

    );
  }

  return (
    <div>
      <Navbar />
      <div>
        <h1 className="mx-24 font-bold text-xl my-10">Create Post</h1>
      </div>

      <div className="flex">
        <div
          onClick={handelinputarea}
          className="mx-32 my-16 h-90 w-80 bg-gray-200 rounded-[30px] cursor-pointer flex items-center justify-center"
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)} 
              alt="Preview"
              className="h-full w-full object-cover rounded-[30px]"
            />
          ) : (
            <span className="text-gray-500">Upload</span>
          )}
          <input
            type="file"
            id="imageUpload"
            onChange={handelimagechange}
            style={{ display: "none" }}
            required
          />
        </div>

        <div className="mt-16">
          <h1>Title</h1>
          <div>
            <input
              value={title}
              onChange={handleTitleChange}
              className="bg-gray-200 w-96 h-10 p-2 rounded-[10px]"
              type="text"
              placeholder="Add a Title"
            />
          </div>

          <div className="mt-10">
            <h1>Description</h1>
            <div>
              <input
                value={description}
                onChange={handleDescriptionChange}
                className="bg-gray-200 w-96 h-10 p-2 rounded-[10px]"
                type="text"
                placeholder="Add the Description"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-16 bg-red-500 p-4 rounded-[25px] text-white font-bold"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
