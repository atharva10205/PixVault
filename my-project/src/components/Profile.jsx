import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [ProfilePictureUrl, setProfilePictureUrl] = useState(null);
  const [ProfilePicturechange, setProfilePicturechange] = useState("");
  const [modalImagePreview, setModalImagePreview] = useState(null); // New state for modal preview
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settingmodal, setsettingmodal] = useState(false);
  const [darkmodemodal, setdarkmodemodal] = useState(true);
  const [userId, setuserId] = useState();
  const [followersnumber, setfollowersnumber] = useState();
  const [followingpfpurl, setFollowingPfpUrl] = useState([]);
  const [followingusername, setFollowingUsername] = useState([]);
  const [followersmodal, setfollowersmodal] = useState(false);


  useEffect(() => {
    axios
      .post("http://localhost:5000/verify", {}, { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

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

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUsername(null);
      setProfilePictureUrl(null);
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const created = () => {
    navigate("/created");
  };

  const save = () => {
    navigate("/save");
  };

  const handleprofilepictureinput = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicturechange(file);
      setModalImagePreview(URL.createObjectURL(file)); // Temporary modal preview
    }
  };

  useEffect(() => {
    return () => {
      if (modalImagePreview) URL.revokeObjectURL(modalImagePreview); // Clean up the URL
    };
  }, [modalImagePreview]);

  const handleprofilepictureupload = async () => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", ProfilePicturechange);

      const response = await axios.post(
        "http://localhost:5000/uploadprofilephoto",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.message);
      setProfilePictureUrl(response.data.imageUrl); // Update profile picture after upload
      setIsModalOpen(false); // Close modal after upload
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  useEffect(() => {
    const fetchprofilephoto = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profilephoto", {
          withCredentials: true,
        });
        if (response.data.imageUrl) {
          setProfilePictureUrl(response.data.imageUrl);
          setuserId(response.data.userId);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchprofilephoto();
  }, []);

  useEffect(() => {
  console.log(userId)
  }, [userId])

  const handlesettingclick = () => {
    setsettingmodal((prev) => !prev);
  };

  const setdarkmode = () => {
    const darkmodeswitch = async () => {
      const response = await axios.post("http://localhost:5000/darkmodeswitch");
      setdarkmodemodal((prev) => !prev); 
    };
  };

  useEffect(() => {
    const cheaknumberoffollowers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/cheaknumberoffollowers/${userId}`,
          { withCredentials: true }
        );
        setfollowersnumber(response.data.count);
      } catch (error) {
        console.log("error in frontend of followers", error);
      }
    };
    cheaknumberoffollowers();
  }, [userId]);

  useEffect(() => {
    const fetchfollowerslist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchfollowerslist/${userId}`,
          { withCredentials: true }
        );
        setFollowingPfpUrl(response.data.profilePictureUrls);
        setFollowingUsername(response.data.usernames);
      } catch (error) {
        console.error("Error fetching followers list", error);
      }
    };
    fetchfollowerslist();
  }, [userId]);

  const handlefollowersclick = () => {
    setfollowersmodal(true);
  };

  const closeFollowersModal = () => {
    setfollowersmodal(false);
  };





  return (
    <div>
      <Navbar />

      <div className="flex justify-center align-middle h-[170px]">
        <div>
          <img
            src={ProfilePictureUrl}
            className="mx-32 my-16 mb-14 h-40 w-40 rounded-full object-cover cursor-pointer bg-slate-200"
            onClick={() => setIsModalOpen(true)}
            alt=""
          />
        </div>
      </div>

      <div className="font-sans text-[30px] mt-[60px] text-center">
        {username}
      </div>

      <div
        className="flex items-center justify-center cursor-pointer hover:underline"
        onClick={handlefollowersclick}
      >
        {followersnumber} Followers
      </div>

      <div className="flex justify-center align-middle gap-4 mt-7">
        <button className="bg-gray-200 p-4 text-[17px] font-semibold rounded-[30px]">
          Share
        </button>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-gray-200 p-4 text-[17px] font-semibold rounded-[30px] text-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/signup")}
            className="bg-gray-200 p-4 text-[17px] font-semibold rounded-[30px] text-green-600"
          >
            Signup
          </button>
        )}
      </div>

      <div className="flex justify-center align-middle gap-7 mt-[40px] mb-10">
        <button
          className={`p-[13px] text-[15px] font-sans rounded-[30px] ${
            isActive("/created") ? "bg-black text-white" : "bg-white text-black"
          }`}
          onClick={created}
        >
          Created
        </button>
        <button
          className={`p-[13px] text-[15px] font-sans rounded-[30px] ${
            isActive("/save") ? "bg-black text-white" : "bg-white text-black"
          }`}
          onClick={save}
        >
          Save
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] md:w-[500px] h-[300px] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-3xl font-bold text-red-600 hover:text-red-800"
            >
              &times;
            </button>

            <div className="flex justify-center mb-6">
              <img
                src={
                  modalImagePreview ||
                  ProfilePictureUrl ||
                  "default-placeholder.png"
                }
                alt="Modal Preview"
                className="h-40 w-40 rounded-full object-cover border-4 border-black bg-slate-200"
              />
            </div>

            <div className="flex justify-between gap-6 mt-6">
              <button
                onClick={() => document.getElementById("fileInput").click()}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-md transition-all"
              >
                Edit
              </button>
              <button
                className="bg-black hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transition-all"
                onClick={handleprofilepictureupload}
              >
                Upload
              </button>
            </div>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleprofilepictureinput}
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-4 h-8 w-8 left-4 cursor-pointer">
        <img
          onClick={handlesettingclick}
          src="https://static.vecteezy.com/system/resources/previews/020/522/570/non_2x/cog-gear-industrial-icon-settings-icon-png.png"
          alt=""
        />
      </div>

      {settingmodal && (
        <div className="fixed bottom-4 h-80 w-80 rounded-[30px] p-3 bg-gray-300 left-14">
          <div
            className="w-full rounded-[20px] hover:bg-slate-400 p-3"
            onClick={setdarkmode}
          >
            Darkmode
          </div>
        </div>
      )}

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


export default Profile;
