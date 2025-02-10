import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ProfilePictureUrl, setProfilePictureUrl] = useState(null);
  const [input, setinput] = useState()
  const [searchedimages, setsearchedimages] = useState()

  const handleInput = (event)=>{
    setinput(event.target.value);
  }

  const submitinput = async (e) => {
    if (e.key === 'Enter') {
      navigate(`/search/${input}`);
  
      const response = await axios.get(`http://localhost:5000/search/${input}`, { withCredentials: true });
      setsearchedimages(response.data);
    }
  };
  

  const isActive = (paths) => paths.includes(location.pathname);

  const handleProfileClick = () => {
    navigate('/Profile');
  };

  const handleHomeClick = () => {
    navigate('/Home');
  };

  const handleExploreClick = () => {
    navigate('/Explore');
  };

  const handleCreateClick = () => {
    navigate('/Create');
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
  }, [])

  return (
    <div className="flex px-3 py-5 align-middle sticky top-0 bg-white z-30">
      <div className="flex justify-center items-center">
        <img
          className="h-8 cursor-pointer flex justify-center"
          src="https://e7.pngegg.com/pngimages/969/351/png-clipart-pinterest-logo-area-text-symbol-brand-app-pinterest-text-trademark.png"
          alt="Logo"
        />
      </div>

      <div className="flex gap-1">
        <div>
          <button onClick={handleHomeClick} className={`p-[13px] text-[15px] font-sans rounded-[30px] ${isActive(['/Home']) ? 'bg-black text-white' : 'bg-white text-black'}`}>
            Home
          </button>
        </div>
        <div>
          <button onClick={handleExploreClick} className={`p-[13px] text-[15px] font-sans rounded-[30px] ${isActive(['/Explore' , '/Anime' , '/Car' , '/Food' , '/Cat' , '/Tech' , '/Nature']) ? 'bg-black text-white' : 'bg-white text-black'}`}>
            Explore
          </button>
        </div>
        <div>
          <button onClick={handleCreateClick} className={`p-[13px] text-[15px] font-sans rounded-[30px] ${isActive('/Create') ? 'bg-black text-white' : 'bg-white text-black'}`}>
            Create
          </button>
        </div>

        <input type="text" placeholder="search" className="bg-gray-200 w-[1100px] mr-3 rounded-[50px] placeholder-black p-3 text-black"
        onKeyDown={submitinput}
        onChange={handleInput}/>

        <div className='flex justify-center items-center gap-5 cursor-pointer'>
          {/* <img className='h-8' src="https://cdn-icons-png.flaticon.com/128/2529/2529521.png" alt="Notifications" />
          <img className='h-7' src="https://cdn-icons-png.flaticon.com/128/1370/1370907.png" alt="Messages" /> */}

          {ProfilePictureUrl  ? (
            <img onClick={handleProfileClick} className='h-10 w-10 rounded-full object-cover' src={ProfilePictureUrl} alt="Profile" />
          ) : (
            <img onClick={handleProfileClick} className='h-8' src="https://cdn-icons-png.freepik.com/512/8861/8861091.png" alt="Default Profile" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
