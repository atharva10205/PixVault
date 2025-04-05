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

      <div className="flex items-center justify-center font-sans font-semibold text-[44px] mb-[40px] bg-gradient-to-t from-yellow-500 to-white bg-clip-text text-transparent">
        Stay Inspired
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 m-6">
          <div className="relative w-[450px] h-[450px]  m-2 cursor-pointer rounded-lg shadow-lg ">
            <img
              src="https://i.pinimg.com/736x/76/8d/16/768d16b32de5c1a638d90b6142552415.jpg"
              onClick={handleanimeimageclick}
              className="w-[450px] h-[450px] object-cover rounded-[50px]"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[30px]">
              Anime
            </div>
          </div>

          <div className="relative w-[450px] h-[450px] m-2 cursor-pointer rounded-lg shadow-lg">
            <img
              src="https://i.pinimg.com/474x/13/8f/06/138f0675237eec3563d1475ec63f7262.jpg"
              onClick={handlecarsimageclick}
              className="w-[450px] h-[450px] object-cover rounded-[50px]"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[30px]">
              Cars
            </div>
          </div>

          <div className="relative w-[450px] h-[450px] m-2 cursor-pointer rounded-lg shadow-lg">
            <img
              src="https://i.pinimg.com/736x/8f/a6/20/8fa620529e7f59ffc97dd7e35f728053.jpg"
              onClick={handlefoodimageclick}
              className="w-[450px] h-[450px] object-cover rounded-[50px]"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[30px]">
              Food
            </div>
          </div>

          <div className="relative w-[450px] h-[450px] m-2 cursor-pointer rounded-lg shadow-lg">
            <img
              src="https://wallpapercave.com/wp/wp7809165.png"
              onClick={handlecatimageclick}
              className="w-[450px] h-[450px] object-cover rounded-[50px]"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[30px]">
              Cat
            </div>
          </div>

          <div className="relative w-[450px] h-[450px] m-2 cursor-pointer rounded-lg shadow-[30px]">
            <img
              src="https://i.pinimg.com/736x/6c/10/05/6c10057c665df96576122553ffa114ed.jpg"
              onClick={handlenatureimageclick}
              className="w-[450px] h-[450px] object-cover rounded-[50px]"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[30px]">
              Nature
            </div>
          </div>

          <div className="relative w-[450px] h-[450px] m-2 cursor-pointer rounded-lg shadow-lg">
            <img
              src="https://i.pinimg.com/736x/e1/22/34/e122343ac7ddb125851689e1fb05cc4a.jpg"
              onClick={handletechimageclick}
              className="w-[450px] h-[450px] object-cover rounded-[50px]"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-[50px] pointer-events-none"></div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-[30px]">
              Tech
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[40px]">
        <div className="flex items-center justify-center font-sans font-semibold text-[20px]">
          That's all for today!
        </div>
        <div className="flex items-center justify-center font-sans font-semibold text-[28px]">
          Come back tomorrow for more inspiration
        </div>
      </div>

      <div className="flex items-center justify-center pb-40">
        <button
          onClick={handelhomebuttonclick}
          className="bg-yellow-400 px-8 py-4 rounded-[30px] font-semibold "
        >
          Home
        </button>
      </div>

      <div></div>
    </div>
  );
};

export default Explore;
