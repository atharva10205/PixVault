import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Chatlist = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [userId, setUserId] = useState();
  const [followers, setFollowers] = useState([]); // State to store followers' data

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/username",
          {},
          { withCredentials: true }
        );
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profilephoto", {
          withCredentials: true,
        });
        if (response.data.imageUrl) {
          setProfilePictureUrl(response.data.imageUrl);
          setUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchProfilePhoto();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchFollowersList = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchfollowerslist111/${userId}`,
          { withCredentials: true }
        );

        console.log("The follower list from backend is", response.data);

        const followersData = response.data.map((follower) => ({
          userId: follower.userId, 
          username: follower.followerusername,
          profilePictureUrl:
            follower.followersPFP ||
            "https://cdn-icons-png.freepik.com/512/8861/8861091.png",
        }));

        setFollowers(followersData);
        console.log("The processed follower data is", followersData);
      } catch (error) {
        console.error("Error fetching followers list", error);
      }
    };
    fetchFollowersList();
  }, [userId]);

  return (
    <div className="min-h-screen bg-black">
    <Navbar />
  
    <div className="p-4 border-r-0 md:border-r-2 border-gray-300 min-h-screen w-full md:w-[500px]">
      <div className="flex items-center space-x-3">
        <img
          className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full"
          src={
            profilePictureUrl ||
            "https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg"
          }
          alt="Profile"
        />
  
        <h2 className="text-xl sm:text-[33px] font-semibold font-sans text-white flex items-center">
          {username}
        </h2>
      </div>
  
      <p className="text-white mt-7 text-base sm:text-lg">Messages</p>
  
      <div className="flex flex-col mb-6">
        {followers.map((follower, index) => (
          <div
            key={index}
            onClick={() => navigate(`/chate/${follower.userId}`)}
            className="h-[70px] w-full flex items-center p-3 mt-3 rounded-xl text-white hover:bg-yellow-400 hover:text-black transition duration-200"
          >
            <img
              className="h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] rounded-full mr-4"
              src={
                follower.profilePictureUrl ||
                "https://cdn-icons-png.freepik.com/512/8861/8861091.png"
              }
              alt={follower.username}
            />
            <span className="text-sm sm:text-base">{follower.username}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  );
};

export default Chatlist;
