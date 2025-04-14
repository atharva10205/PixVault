import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar1 from "./Navbar1";

const socket = io("http://localhost:5001");

const Chate = () => {
  const navigate = useNavigate();
  const [username1, setUsername] = useState();
  const [profilePictureUrl, setProfilePictureUrl] = useState();
  const [userId, setUserId] = useState();
  const [followers, setFollowers] = useState([]);
  const { followerId } = useParams();
  const [currentuserID, setcurrentuserID] = useState();
  const [reciverPFP, setreciverPFP] = useState();
  const [reciverNAME, setreciverNAME] = useState();
  const [inputmessege, setinputmessege] = useState("");
  const [roomID, setroomID] = useState();
  const [messeges, setmesseges] = useState([]);
  const [messeges1, setmesseges1] = useState([]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messeges, messeges1]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.post(
          "https://pixvault.onrender.com/username",
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
        const response = await axios.get("https://pixvault.onrender.com/profilephoto", {
          withCredentials: true,
        });

        const imageUrl =
          response.data.imageUrl ||
          "https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg";

        setProfilePictureUrl(imageUrl);
        setUserId(response.data.userId);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePictureUrl(
          "https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg"
        );
      }
    };

    fetchProfilePhoto();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchFollowersList = async () => {
      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/fetchfollowerslist111/${userId}`,
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

  useEffect(() => {
    const fetchclickedfollowersinfo = async () => {
      try {
        const response = await axios.get(
          `https://pixvault.onrender.com/fetchclickedfollowersinfo/${followerId}`,
          { withCredentials: true }
        );
        setreciverPFP(response.data.imageUrl);
        setreciverNAME(response.data.clickedpersonusername);
      } catch (error) {
        console.error("Error in fetchclickedfollowersinfo:", error);
      }
    };
    if (followerId) {
      fetchclickedfollowersinfo();
    }
  }, [followerId]);

  useEffect(() => {
    if (followerId) {
      socket.emit("joinRoom", followerId);
    }
  }, [followerId]);

  useEffect(() => {
    const fetchcurrentuserID = async () => {
      try {
        const response = await axios.post(
          "https://pixvault.onrender.com/fetchcurrentuserID",
          {},
          { withCredentials: true }
        );
        setcurrentuserID(response.data.userId);
      } catch (error) {
        console.error("Error fetching current user ID:", error);
      }
    };
    fetchcurrentuserID();
  }, []);

  useEffect(() => {
    if (followerId && currentuserID) {
      const combined = `${followerId}${currentuserID}`;
      const sortedRoomID = combined.split("").sort().join("");
      setroomID(sortedRoomID);
    }
  }, [followerId, currentuserID]);

  useEffect(() => {
    if (roomID) {
      socket.emit("joinRoom", roomID);
      console.log(`${socket.id} joined room with ID: ${roomID}`);
    }
  }, [roomID]);

  useEffect(() => {
    socket.on("receiveMessage", ({ message, sender }) => {
      console.log(`Message from ${sender}: ${message}`);
      setmesseges((prevMessages) => [
        ...prevMessages,
        { message, sendername: sender, timestamp: new Date() },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    setmesseges([]);
  }, [followerId, roomID]);

  const handleMessageSubmit = async (reciverNAME, message) => {
    setinputmessege("");

    try {
      const newMessage = {
        room: roomID,
        message: inputmessege,
        sender: username1,
      };

      socket.emit("sendMessage", newMessage);

      // Save the message to the database
      const response = await axios.post(
        `https://pixvault.onrender.com/PostMessageToDatabase/${reciverNAME}/${message}/${followerId}/${roomID}`,
        {},
        { withCredentials: true }
      );

      console.log("Message saved to database:", response.data);

      // Add the message to the local state for immediate rendering
      setmesseges((prevMessages) => [
        ...prevMessages,
        { message: inputmessege, sendername: username1, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error in saving message to database:", error);
    }
  };

  useEffect(() => {
    const fetchmesseges = async () => {
      const response = await axios.get(
        `https://pixvault.onrender.com/fetchMessages/${roomID}`,
        { withCredentials: true }
      );
      setmesseges1(response.data);
    };
    fetchmesseges();
  }, [roomID]);

 
  const allMessages = [...messeges1, ...messeges];

  // const handel_videocall_click = async () => {
  //   navigate(`/Videocall/${followerId}/${currentuserID}`);
  // };

  // const [image, setImage] = useState(null);

  // const handle_images_input = async (event,reciverNAME, inputmessege) => {
  //   const file = event.target.files[0];
  //   setImage(file);

  //   const formData = new FormData();
  //   formData.append("image", file);

  //   const response = await axios.post("https://pixvault.onrender.com/chate_image", {
  //     withCredentials: true,
  //     formData,
  //   });
  // };

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling on the entire page
    return () => {
      document.body.style.overflow = ""; // Reset when component unmounts
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
    <Navbar1 />
    <div className="flex flex-1">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block p-4 border-r-2 border-gray-300 min-h-screen w-full md:w-[500px]">
        <div className="flex items-center mb-4">
          <img
            className="h-[50px] w-[50px] rounded-full"
            src={
              profilePictureUrl ||
              "https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg"
            }
            alt="Profile"
          />
          <h2 className="text-lg font-semibold font-sans text-white p-3 text-[33px]">
            {username1 || "Your Username"}
          </h2>
        </div>
  
        <p className="text-lg font-semibold text-yellow-400 mt-4 mb-2">
          Messages
        </p>
  
        <div
          className="flex flex-col space-y-3 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {followers.map((follower, index) => (
            <div
              key={index}
              onClick={() => navigate(`/chate/${follower.userId}`)}
              className="h-[70px] w-full flex items-center p-3 mt-3 rounded-xl text-white hover:bg-yellow-400 hover:text-black"
            >
              <img
                className="h-[50px] w-[50px] rounded-full mr-4"
                src={
                  follower.profilePictureUrl || "https://via.placeholder.com/50"
                }
                alt={follower.username}
              />
              <span>{follower.username}</span>
            </div>
          ))}
        </div>
      </div>
  
      {/* Chat Section - always visible */}
      <div className="flex flex-col w-full p-4 ml-[1px]">
        <div className="flex items-center justify-between p-1 bg-black border-b-2 border-gray-300">
          <div className="flex items-center p-1 bg-black">
            <img
              className="h-[50px] w-[50px] rounded-full mr-4"
              src={
                reciverPFP ||
                "https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg"
              }
              alt="Profile"
            />
            <h2 className="text-xl text-white font-semibold ">{reciverNAME}</h2>
          </div>
        </div>
  
        <div
          ref={chatContainerRef}
          className="flex-grow bg-black-100 p-4 rounded-lg overflow-y-auto mt-4"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          {allMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.sendername === username1 ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-center space-x-2 ${
                  msg.sendername === username1 ? "flex-row-reverse" : ""
                }`}
              >
                <img
                  className="h-[30px] ml-3 w-[30px] rounded-full"
                  src={
                    (msg.sendername === username1
                      ? profilePictureUrl
                      : reciverPFP) ||
                    "https://i.pinimg.com/736x/c9/3a/d1/c93ad1538753e96aa7a99de8b058ed60.jpg"
                  }
                  alt={
                    msg.sendername === username1 ? username1 : reciverNAME
                  }
                />
  
                <div className="flex p-3 bg-gray-300 rounded-[30px]">
                  <div
                    className={`${
                      msg.sendername === username1
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className=" md:mt-4 mt-8  flex items-center">
          <input
            value={inputmessege}
            onChange={(e) => setinputmessege(e.target.value)}
            type="text"
            className="bg-gray-200 h-[50px] rounded-[30px] w-full px-2"
            placeholder="Type message"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleMessageSubmit(reciverNAME, inputmessege);
                setinputmessege("");
              }
            }}
          />
          <img
            src="https://i.pinimg.com/736x/79/e6/25/79e6255960cbfb9f6a367e2ed434de9b.jpg"
            onClick={() => handleMessageSubmit(reciverNAME, inputmessege)}
            className="h-[40px] w-[34px] ml-4 rounded-[100px] cursor-pointer scale-150"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Chate;
