import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const Explore = () => {
  const navigate = useNavigate();
  const [anime, setanime] = useState();
  const [car, setcar] = useState();
  const [food, setfood] = useState();
  const [nature, setnature] = useState();
  const [tech, settech] = useState();

  useEffect(() => {
    setanime("Anime");
    setcar("Car");
    setfood("Food");
    setnature("Natuer");
    settech("Tech");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handelhomebuttonclick = () => {
    navigate("/Home");
  };

  const handlecarsimageclick = () => {
    navigate("/Car");
  };

  const handlefoodimageclick = () => {
    navigate("/Food");
  };

  const handlecatimageclick = () => {
    navigate("/Cat");
  };

  const handlenatureimageclick = () => {
    navigate("/Nature");
  };

  const handletechimageclick = () => {
    navigate("/Tech");
  };

  const handleanimeimageclick = () => {
    navigate("/Anime");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
    <Navbar />
  
    <div className="flex items-center justify-center font-sans font-semibold text-[28px] sm:text-[44px] mb-6 sm:mb-[40px] px-4 text-center bg-gradient-to-t from-yellow-500 to-white bg-clip-text text-transparent">
      Stay Inspired
    </div>
  
    <div className="flex-grow flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {[
          {
            src: "https://i.pinimg.com/736x/76/8d/16/768d16b32de5c1a638d90b6142552415.jpg",
            onClick: handleanimeimageclick,
            label: "Anime",
          },
          {
            src: "https://i.pinimg.com/474x/13/8f/06/138f0675237eec3563d1475ec63f7262.jpg",
            onClick: handlecarsimageclick,
            label: "Cars",
          },
          {
            src: "https://i.pinimg.com/736x/8f/a6/20/8fa620529e7f59ffc97dd7e35f728053.jpg",
            onClick: handlefoodimageclick,
            label: "Food",
          },
          {
            src: "https://wallpapercave.com/wp/wp7809165.png",
            onClick: handlecatimageclick,
            label: "Cat",
          },
          {
            src: "https://i.pinimg.com/736x/6c/10/05/6c10057c665df96576122553ffa114ed.jpg",
            onClick: handlenatureimageclick,
            label: "Nature",
          },
          {
            src: "https://i.pinimg.com/736x/e1/22/34/e122343ac7ddb125851689e1fb05cc4a.jpg",
            onClick: handletechimageclick,
            label: "Tech",
          },
        ].map(({ src, onClick, label }, index) => (
          <div
            key={index}
            className="relative w-full sm:w-[450px] h-[300px] sm:h-[450px] mx-auto cursor-pointer rounded-lg shadow-lg"
          >
            <img
              src={src}
              onClick={onClick}
              className="w-full h-full object-cover rounded-[30px] sm:rounded-[50px]"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[30px] sm:rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-semibold text-[20px] sm:text-[30px]">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  
    <div className="mt-10 sm:mt-[40px] text-center px-4">
      <div className="font-sans text-white font-semibold text-[18px] sm:text-[20px]">
        That's all for today!
      </div>
      <div className="font-sans font-semibold text-white text-[22px] sm:text-[28px]">
        Come back tomorrow for more inspiration
      </div>
    </div>
  
    <div className="flex items-center justify-center py-10 sm:pb-40">
      <button
        onClick={handelhomebuttonclick}
        className="hidden sm:block bg-yellow-400 px-6 py-3 sm:px-8 sm:py-4 rounded-[20px] sm:rounded-[30px] font-semibold"
        >
        Home
      </button>
    </div>
  </div>
  
  );
};

export default Explore;
