import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Userprofile1 = () => {
  const { username } = useParams();
  const { userId } = useParams();

  const [profilepicture, setProfilePicture] = useState(
    "https://cdn-icons-png.freepik.com/512/8861/8861091.png"
  );
  const [images, setImages] = useState([]);
  //const [username, setUsername] = useState("");
  const [pfpuserid, setpfpuserid] = useState();
  const [followingmodal, setfollowingmodal] = useState();
  const [followersnumber, setfollowersnumber] = useState();
  const [followersmodal, setfollowersmodal] = useState(false);
  const [followingpfpurl, setFollowingPfpUrl] = useState([]);
  const [followingusername, setFollowingUsername] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViewersProfilePhoto = async () => {
      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/fetchviewersprofilepicture1/${userId}`,
          { withCredentials: true }
        );

        const pfp =
          response.data[0].imageUrl ||
          "https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg";
        setProfilePicture(pfp);
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      }
    };

    fetchViewersProfilePhoto();
  }, [userId]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/fetchImages/${userId}`,
          { withCredentials: true }
        );

        setImages(response.data.images); // Fix: Extract the array from the object
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchImages();
  }, [userId]);

  useEffect(() => {
    const checkifFollowing = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/checkifFollowing1/${userId}`,
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
  }, [userId]);

  useEffect(() => {
    const cheaknumberoffollowers = async () => {
      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/cheaknumberoffollowers/${userId}`,
          { withCredentials: true }
        );
        setfollowersnumber(response.data.count);
      } catch (error) {
        console.log("error in frontend of followers", error);
      }
    };
    cheaknumberoffollowers();
  }, [userId]);

  const handleImageClick = async (imageId) => {
    try {
      const response = await axios.get(
        `https://pixvault.onrender.com/getobjectid/${imageId}`,
        {},
        { withCredentials: true }
      );
      const objectId = response.data.objectId;
      navigate(`/image/${objectId}`);
    } catch (error) {
      console.error("Error in handleImageClick:", error);
    }
  };

  const handlefollowbutton = async () => {
    try {
      const response = await axios.post(
        `https://pixvault.onrender.com/handlefollowebutton1/${userId}`,
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

  const handleunfollowfollowbutton = async () => {
    try {
      const response = await axios.post(
        `https://pixvault.onrender.com/handleunfollowfollowbutton1/${userId}`,
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
          `https://pixvault.onrender.com/fetchfollowerslist11/${userId}`,
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
        `https://pixvault.onrender.com/handel_message_follow1/${userId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error in handlefollowbutton:", error);
    }

    navigate(`/chate/${userId}`);
  };

  const handleSaveClick = async (imageId) => {
    try {
      await axios.post(
        `https://pixvault.onrender.com/handleuploadsave/${imageId}`,
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

  <div className="profile-container px-4 sm:px-8 py-6">
    {/* Profile Info Section */}
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
      <img
        className="rounded-full w-32 h-32 sm:w-[200px] sm:h-[200px] object-cover"
        src={profilepicture}
        alt="Profile"
      />

      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl text-white font-bold">{username}</h2>

        <div
          className="cursor-pointer text-white mt-2 hover:underline decoration-yellow-400"
          onClick={handlefollowersclick}
        >
          {followersnumber} Followers
        </div>

        <div className="mt-4 flex sm:flex-row gap-3 justify-center sm:justify-start">
          {followingmodal ? (
            <button
              className="bg-gray-400 px-4 py-2 rounded-full text-black font-bold hover:text-black"
              onClick={handleunfollowfollowbutton}
            >
              UnFollow
            </button>
          ) : (
            <button
              className="bg-yellow-400 px-4 py-2 rounded-full text-black font-bold hover:text-black"
              onClick={handlefollowbutton}
            >
              Follow
            </button>
          )}

          <button
            className="bg-yellow-400 px-4 py-2 rounded-full text-black font-bold hover:text-black"
            onClick={navigate_to_chat}
          >
            Message
          </button>
        </div>
      </div>
    </div>

    {/* Images Section */}
    <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-5 gap-4">
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
              className="absolute top-3 right-3 bg-yellow-400 rounded-full text-black p-2 sm:p-3 opacity-0 group-hover:opacity-100 hover:bg-yellow-500 transition duration-150"
              onClick={() => handleSaveClick(image._id)}
            >
              Save
            </button>
            <h1 className="text-sm sm:text-base text-white font-semibold mt-2">
              {image.title}
            </h1>
            <p className="text-xs sm:text-sm text-white">{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Followers Modal */}
  {followersmodal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-[80vh] p-6 relative overflow-y-auto">
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

export default Userprofile1;
