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
        `http://localhost:5000/fetchfollowerslist11/${userId}`,
        { withCredentials: true }
      );

      console.log("the datatata of responce is ",response);

      const followersData = await response.data.followersId.map((followerId, index) => ({
        followerId,
        username: response.data.usernames[index] || "Unknown",
        profilePictureUrl:
          response.data.profilePictureUrls[index] ||
          "https://cdn-icons-png.freepik.com/512/8861/8861091.png",
      }));

      setFollowers(followersData);
    } catch (error) {
      console.error("Error fetching followers list", error);
    }
  };
  fetchFollowersList();
}, [userId]);



  return (
    <div className="h-screen">
      <Navbar />

      <div className="p-4 border-r-2 border-gray-300 h-full w-[500px]">
        <div className="flex align-middle items-center">
          <img
            className="h-[50px] w-[50px] rounded-[60px]"
            src={profilePictureUrl}
            alt=""
          />
          <h2 className="text-lg font-semibold font-sans p-3 mb-4 text-[33px]">
            {username}
          </h2>
        </div>

        <p>Messages</p>

        <div className="flex flex-col mb-6">
          {followers.map((follower, index) => (
            <div
              key={index}
              onClick={() => navigate(`/chate/${follower.followerId}`)}
              className="h-[70px] w-[470px] flex align-middle items-center p-3 mt-3 rounded-xl hover:bg-gray-200"
            >
              <img
                className="h-[50px] w-[50px] rounded-[60px] mr-4"
                src={follower.profilePictureUrl || "https://cdn-icons-png.freepik.com/512/8861/8861091.png"}
                alt={follower.username}
              />
              <span>{follower.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatlist;
