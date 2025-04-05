import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Userprofile = () => {
  const { e } = useParams();
  const [profilepicture, setProfilePicture] = useState(
    "https://cdn-icons-png.freepik.com/512/8861/8861091.png"
  );
  const [images, setImages] = useState([]);
  const [username, setUsername] = useState("");
  const [pfpuserid, setpfpuserid] = useState();
  const [followingmodal, setfollowingmodal] = useState();
  const [followersnumber, setfollowersnumber] = useState();
  const [followersmodal, setfollowersmodal] = useState(false);
  const [followingpfpurl, setFollowingPfpUrl] = useState([]);
  const [followingusername, setFollowingUsername] = useState([]);
  const [userID, setuserID] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchViewersProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchviewersprofilepicture/${e}`,
          { withCredentials: true }
        );

        const { imageUrl, username, images, userid } = response.data;
        setUsername(username || "Unknown User");
        setProfilePicture(
          imageUrl || "https://cdn-icons-png.freepik.com/512/8861/8861091.png"
        );
        setImages(images);
        setpfpuserid(userid);
        setuserID(userid);
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        setProfilePicture(
          "https://cdn-icons-png.freepik.com/512/8861/8861091.png"
        );
        setUsername("Unknown User");
      }
    };

    fetchViewersProfile();
  }, [e]);

  useEffect(() => {
    const checkifFollowing = async () => {
      if (!pfpuserid) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/checkifFollowing/${pfpuserid}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setfollowingmodal(true);
        } else if (response.status === 404) {
          setfollowingmodal(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setfollowingmodal(false);
          console.log("User is not following:", error.response.data.message);
        } else {
          console.error("Error in checkifFollowing:", error);
        }
      }
    };

    checkifFollowing();
  }, [pfpuserid]);

  useEffect(() => {
    const cheaknumberoffollowers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/cheaknumberoffollowers/${pfpuserid}`,
          { withCredentials: true }
        );
        setfollowersnumber(response.data.count);
      } catch (error) {
        console.log("error in frontend of followers", error);
      }
    };
    cheaknumberoffollowers();
  }, [pfpuserid]);

  const handleImageClick = async (imageId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getobjectid/${imageId}`,
        {},
        { withCredentials: true }
      );
      const objectId = response.data.objectId;
      navigate(`/image/${objectId}`);
    } catch (error) {
      console.error("Error in handleImageClick:", error);
    }
  };

  const handleunfollowfollowbutton = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/handleunfollowfollowbutton/${pfpuserid}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setfollowingmodal(false);
      } else {
        console.error("Error unfollowing user:", response.data.message);
      }
    } catch (error) {
      console.error("Error in handleunfollowfollowbutton:", error);
    }
  };

  const handlefollowersclick = () => {
    setfollowersmodal(true);
  };

  const closeFollowersModal = () => {
    setfollowersmodal(false);
  };

  useEffect(() => {
    const fetchfollowerslist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchfollowerslist/${pfpuserid}`,
          { withCredentials: true }
        );
        setFollowingPfpUrl(response.data.profilePictureUrls);
        setFollowingUsername(response.data.usernames);
      } catch (error) {
        console.error("Error fetching followers list", error);
      }
    };
    fetchfollowerslist();
  }, [pfpuserid]);

  const navigate_to_chat = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/handel_message_follow/${pfpuserid}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error in handlefollowbutton:", error);
    }

    navigate(`/chate/${userID}`);
  };

  const handlefollowbutton = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/handlefollowebutton/${pfpuserid}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setfollowingmodal(true);
      } else {
        console.error("Error following user:", response.data.message);
      }
    } catch (error) {
      console.error("Error in handlefollowbutton:", error);
    }
  };

  const handleSaveClick = async (imageId) => {
    try {
      await axios.post(
        `http://localhost:5001/handleuploadsave/${imageId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Error saving image:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="profile-container">
        <div className="flex items-center gap-4 ml-8 mb-6 p-5">
          <img
            className="profile-image rounded-full w-[200px] h-[200px] object-cover"
            src={profilepicture}
            alt="Profile"
          />
          <div className="ml-7">
            <div className="profile-info">
              <h2 className="text-2xl text-white font-bold">{username}</h2>
            </div>
            <div
              className="cursor-pointer text-white hover:underline decoration-yellow-400"
              onClick={handlefollowersclick}
            >
              {followersnumber} Followers
            </div>
            <div>
              {followingmodal ? (
                <button
                  className="bg-gray-400 p-3 mt-3 rounded-[25px] text-black font-bold hover:text-black"
                  onClick={handleunfollowfollowbutton}
                >
                  UnFollow
                </button>
              ) : (
                <button
                  className="bg-yellow-400 p-3 mt-3 rounded-[25px] text-black font-bold hover:text-black"
                  onClick={handlefollowbutton}
                >
                  Follow
                </button>
              )}
              <button
                className="bg-yellow-400 p-3 ml-3 mt-3 rounded-[25px] text-black font-bold hover:text-black"
                onClick={navigate_to_chat}
              >
                message
              </button>
            </div>
          </div>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-5 gap-4 p-5">
          {images.map((image, index) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <div className="block relative group">
                <img
                  className="rounded-xl w-full object-cover cursor-pointer group-hover:brightness-75 transition duration-200"
                  src={image.url}
                  alt={`User uploaded ${index}`}
                  onClick={() => handleImageClick(image._id)}
                />
                <button
                  className="absolute top-4 right-4 bg-yellow-400 rounded-full text-black p-3 opacity-0 group-hover:opacity-100 hover:bg-yellow-500 transition duration-150"
                  onClick={() => handleSaveClick(image._id)}
                >
                  Save
                </button>
                <h1 className="text-base text-white font-semibold mt-2">
                  {image.title}
                </h1>
                <p className="text-sm text-white">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {followersmodal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 h-96 p-6 relative overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
              onClick={closeFollowersModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Followers</h2>
            <div className="space-y-4">
              {followingpfpurl &&
              followingusername &&
              followingusername.length > 0 ? (
                followingusername.map((username, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={
                        followingpfpurl[index] ||
                        "https://cdn-icons-png.freepik.com/512/8861/8861091.png"
                      }
                      alt={`Follower ${username}`}
                    />
                    <span className="font-semibold">{username}</span>
                  </div>
                ))
              ) : (
                <p>No followers</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userprofile;
