import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

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

        const followersData = response.data.followersId.map(
          (followerId, index) => ({
            followerId,
            username: response.data.usernames[index] || "Unknown",
            profilePictureUrl:
              response.data.profilePictureUrls[index] ||
              "https://cdn-icons-png.freepik.com/512/8861/8861091.png",
          })
        );
        setFollowers(followersData);
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
          `http://localhost:5000/fetchclickedfollowersinfo/${followerId}`,
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
          "http://localhost:5000/fetchcurrentuserID",
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
        sender: username1, // Set sender as the current user
      };

      // Emit the message to the server
      socket.emit("sendMessage", newMessage);

      // Save the message to the database
      const response = await axios.post(
        `http://localhost:5000/PostMessageToDatabase/${reciverNAME}/${message}/${followerId}/${roomID}`,
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
        `http://localhost:5000/fetchMessages/${roomID}`,
        { withCredentials: true }
      );
      setmesseges1(response.data);
    };
    fetchmesseges();
  }, [roomID]);

  useEffect(() => {
    console.log("fetched messeges are", messeges1);
  }, [messeges1]);

  const allMessages = [...messeges1, ...messeges];

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-[600px] h-full ml-3 border-r-2 border-gray-300">
          <div className="flex items-center mb-4">
            <img
              className="h-[50px] w-[50px] rounded-full"
              src={profilePictureUrl || "https://via.placeholder.com/50"}
              alt=""
            />
            <h2 className="text-lg font-semibold font-sans p-3 text-[33px]">
              {username1 || "Your Username"}
            </h2>
          </div>

          <p className="text-lg font-semibold mb-2">Messages</p>

          <div
            className="flex flex-col space-y-3 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {followers.map((follower, index) => (
              <div
                key={index}
                onClick={() => navigate(`/chate/${follower.followerId}`)}
                className="h-[70px] w-[410px] flex items-center p-3 rounded-xl hover:bg-red-600 cursor-pointer"
              >
                <img
                  className="h-[50px] w-[50px] rounded-full mr-4"
                  src={
                    follower.profilePictureUrl ||
                    "https://via.placeholder.com/50"
                  }
                  alt={follower.username}
                />
                <span>{follower.username}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full p-4 ml-[1px]">
          <div className="flex items-center p-1 bg-white border-b-2 border-gray-300">
            <img
              className="h-[50px] w-[50px] rounded-full mr-4"
              src={
                reciverPFP ||
                "https://cdn-icons-png.freepik.com/512/8861/8861091.png"
              }
              alt="Profile"
            />
            <h2 className="text-xl font-semibold">{reciverNAME}</h2>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-grow bg-gray-100 p-4 rounded-lg overflow-y-auto mt-4"
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
                    className="h-[30px] w-[30px] rounded-full"
                    src={
                      msg.sendername === username1
                        ? profilePictureUrl
                        : reciverPFP
                    }
                    alt={msg.sendername === username1 ? username1 : reciverNAME}
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

          <div className="mt-4 flex items-center">
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
              src="https://cdn-icons-png.flaticon.com/512/3384/3384552.png"
              onClick={() => handleMessageSubmit(reciverNAME, inputmessege)}
              className="h-[50px] w-[50px] ml-2 rounded-[100px] cursor-pointer"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chate;
