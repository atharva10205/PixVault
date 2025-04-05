import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ProfilePictureUrl, setProfilePictureUrl] = useState(null);
  const [input, setinput] = useState();
  const [searchedimages, setsearchedimages] = useState();
  const audio = new Audio("public/Audio/mmaaAAAaah (1).mp3");

  let clickCount = 0;
  let timer;

  function handleClick() {
    clearTimeout(timer);
    clickCount++;

    if (clickCount === 7) {
      audio.play();
      clickCount = 0;
      return;
    }

    timer = setTimeout(() => {
      clickCount = 0;
    }, 1000);
  }

  const handleInput = (event) => {
    setinput(event.target.value);
  };

  const submitinput = async (e) => {
    if (e.key === "Enter") {
      navigate(`/search/${input}`);

      const response = await axios.get(
        `http://localhost:5000/search/${input}`,
        { withCredentials: true }
      );
      setsearchedimages(response.data);
    }
  };

  const isActive = (paths) => paths.includes(location.pathname);

  const handleProfileClick = () => {
    navigate("/Profile");
  };

  const handleHomeClick = () => {
    navigate("/Home");
  };

  const handleExploreClick = () => {
    navigate("/Explore");
  };

  const handleCreateClick = () => {
    navigate("/Create");
  };

  useEffect(() => {
    const fetchprofilephoto = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profilephoto", {
          withCredentials: true,
        });
        if (response.data.imageUrl) {
          setProfilePictureUrl(response.data.imageUrl);
        } else {
          console.warn("Profile picture not found.");
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchprofilephoto();
  }, []);

  return (
    <div className="flex items-center flex-nowrap overflow-x-auto gap-x-3 px-3 py-4 sticky top-0 bg-black z-30 w-full">
      
      {/* Logo */}
      <img
        onClick={handleClick}
        className="h-[50px] w-[50px] rounded-full object-cover cursor-pointer shrink-0"
        src="https://i.pinimg.com/736x/76/b4/1a/76b41a0dfb235b42fd440032aafae231.jpg"
        alt="Logo"
      />
  
      {/* Buttons */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleHomeClick}
          className={`px-4 py-2 text-sm font-sans rounded-full ${
            isActive(["/Home"])
              ? "bg-yellow-400 text-black"
              : "bg-black text-white border border-white"
          }`}
        >
          Home
        </button>
        <button
          onClick={handleExploreClick}
          className={`px-4 py-2 text-sm font-sans rounded-full ${
            isActive([
              "/Explore",
              "/Anime",
              "/Car",
              "/Food",
              "/Cat",
              "/Tech",
              "/Nature",
            ])
              ? "bg-yellow-400 text-black"
              : "bg-black text-white border border-white"
          }`}
        >
          Explore
        </button>
        <button
          onClick={handleCreateClick}
          className={`px-4 py-2 text-sm font-sans rounded-full ${
            isActive("/Create")
              ? "bg-yellow-400 text-black"
              : "bg-black text-white border border-white"
          }`}
        >
          Create
        </button>
      </div>
  
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        className="bg-black border border-yellow-400 text-white rounded-full px-4 py-2 placeholder-gray-400 w-[40vw] min-w-[200px] max-w-[500px]"
        onKeyDown={submitinput}
        onChange={handleInput}
      />
  
      {/* Profile Icon */}
      <div className="flex items-center justify-center shrink-0">
        {ProfilePictureUrl ? (
          <img
            onClick={handleProfileClick}
            className="h-10 w-10 rounded-full object-cover cursor-pointer"
            src={ProfilePictureUrl}
            alt="Profile"
          />
        ) : (
          <img
            onClick={handleProfileClick}
            className="h-10 w-10 rounded-full cursor-pointer"
            src="https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg"
            alt="Default Profile"
          />
        )}
      </div>
    </div>
  );
  
};

export default Navbar;
