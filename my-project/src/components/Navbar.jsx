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
        `https://pixvault.onrender.com/search/${input}`,
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
        const response = await axios.get("https://pixvault.onrender.com/profilephoto", {
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
    <>
      <div className="flex px-3 py-5 items-center sticky top-0 bg-black z-30">
        <div className="flex items-center">
          <img
            onClick={handleClick}
            className="h-[55px] w-[55px] mr-0 md:mr-5 cursor-pointer rounded-full object-cover"
            src="https://i.pinimg.com/736x/76/b4/1a/76b41a0dfb235b42fd440032aafae231.jpg"
            alt="Logo"
          />
        </div>

        <div className="flex items-center gap-2 flex-grow">
          <div className="hidden md:flex gap-1">
            <button
              onClick={handleHomeClick}
              className={`p-[13px] text-[15px] font-sans rounded-[30px] ${
                isActive(["/Home"])
                  ? "bg-yellow-400 text-black"
                  : "bg-black text-white"
              }`}
            >
              Home
            </button>
            <button
              onClick={handleExploreClick}
              className={`p-[13px] text-[15px] font-sans rounded-[30px] ${
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
                  : "bg-black text-white"
              }`}
            >
              Explore
            </button>
            <button
              onClick={handleCreateClick}
              className={`p-[13px] text-[15px] font-sans rounded-[30px] ${
                isActive("/Create")
                  ? "bg-yellow-400 text-black"
                  : "bg-black text-white"
              }`}
            >
              Create
            </button>
          </div>

          <input
            type="text"
            placeholder="search"
            className="bg-black border-2 border-yellow-400 text-white w-full max-w-[1100px] ml-3 rounded-[50px] px-4 py-2 placeholder-gray-400"
            onKeyDown={submitinput}
            onChange={handleInput}
          />
        </div>

        <div className="ml-4 flex justify-center items-center gap-5 cursor-pointer">
          {ProfilePictureUrl ? (
            <img
              onClick={handleProfileClick}
              className="h-10 w-10 rounded-full object-cover"
              src={ProfilePictureUrl}
              alt="Profile"
            />
          ) : (
            <img
              onClick={handleProfileClick}
              className="h-11 w-11 rounded-full object-cover"
              src="https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg"
              alt="Default Profile"
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-black flex justify-around items-center py-2 md:hidden z-50  ">
        <button
          onClick={handleHomeClick}
          className={`px-5 py-2 mb-1 mt-1 text-sm rounded-[30px] font-sans ${
            isActive(["/Home"])
              ? "bg-yellow-400 text-black"
              : "bg-black text-white  "
          }`}
        >
          Home
        </button>
        <button
          onClick={handleExploreClick}
          className={`px-5 py-2 mb-1 mt-1 text-sm rounded-[30px] font-sans ${
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
              : "bg-black text-white "
          }`}
        >
          Explore
        </button>
        <button
          onClick={handleCreateClick}
          className={`px-5 py-2 mb-1 mt-1 text-sm rounded-[30px] font-sans ${
            isActive("/Create")
              ? "bg-yellow-400 text-black"
              : "bg-black text-white  "
          }`}
        >
          Create
        </button>
      </div>
    </>
  );
};

export default Navbar;
