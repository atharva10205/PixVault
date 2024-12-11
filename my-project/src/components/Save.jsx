import Profile from './Profile'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Save = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [savedimages, setsavedimages] = useState([])

  useEffect(() => {
    const verifytoken = async()=>{

      const response = await axios.post("http://localhost:5000/verify",{},{withCredentials:true});
      if(response.status === 200){setIsAuthenticated(true)}else{setIsAuthenticated(false)};
    }
    verifytoken();
  }, [])


  useEffect(() => {
  const fetchsaved = async()=>{
    try{
      const response = await axios.get("http://localhost:5000/fetchsave",{withCredentials:true});
      setsavedimages(response.data);
    }catch(error){
      console.log("error in frontend fetchsaved")
    }
  }
  fetchsaved();
  }, [])

  const handleImageClick = async (imageId) => {
    try {
      const response = await axios.get(`http://localhost:5000/getobjectid/${imageId}`, { withCredentials: true });
      const objectId = response.data.objectId;
      navigate(`/image/${objectId}`);

    } catch (error) {
      console.error("Error in handleImageClick:", error);
    }
  };

  const handleremoveclick = async (objectId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/removesave/${objectId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setsavedimages(savedimages.filter((image) => image._id !== objectId));
      } else {
        console.error("Failed to remove image");
      }
    } catch (error) {
      console.error("Error in handleremoveclick:", error);
    }
  };


  const handlesigninbutton = ()=>{
    navigate("/signup");
  }

  if (!isAuthenticated) {
    return (
      <div>
      <Profile />
      <hr className="border-t border-gray-300 w-full" />

      <div className="flex flex-col items-center justify-center mt-10 font-bold font-sans">
       You need to signin before Saving
       <button className="bg-red-600 p-3 rounded-[30px] mt-6" onClick={handlesigninbutton}>signup</button>
      </div>
    </div>
    );
  }
  

  return (
    <div>
      <Profile />
      <div className="columns-1 md:columns-2 lg:columns-5 gap-4 p-5">
        {savedimages.map((pin, index) => (
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
                    onClick={() => handleremoveclick(pin._id)}>
                    Remove
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


export default Save
