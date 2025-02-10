import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Image = () => {
  const { objectId } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [similarImages, setSimilarImages] = useState([]);
  const [username, setusername] = useState();
  const [profilepicture, setprofilepicture] = useState("");
  const [title, settitle] = useState();
  const [description, setdescription] = useState();
  const [commentinput, setcommentinput] = useState("");
  const [FetchedComment, setFetchedComment] = useState([]);
  const [fetchCommentusername, setfetchCommentusername] = useState();
  const [imageHeight, setImageHeight] = useState(0);
  const [currentusersprofilepicture, setcurrentusersprofilepicture] =
    useState();
  const [userid, setuserid] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const navigate = useNavigate();
  const imageRef = useRef(null);

  useEffect(() => {
    const verifytoken = async()=>{

      const response = await axios.post("http://localhost:5000/verify",{},{withCredentials:true});
      if(response.status === 200){setIsAuthenticated(true)}else{setIsAuthenticated(false)};
    }
    verifytoken();
  }, [])


  useEffect(() => {
    const verifytoken = async () => {
      const response = await axios.post(
        "http://localhost:5000/verify",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    verifytoken();
  }, []);

  useEffect(() => {
    const fetchuserid = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetchuserid", {
          withCredentials: true,
        });
        setuserid(response.data.userId);
      } catch (error) {
        console.error("Error fetching fetchCommentpfp:", error);
      }
    };
    fetchuserid();
  }, []);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getimageUrl/${objectId}`
        );
        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };
    fetchImageUrl();
  }, [objectId]);

  useEffect(() => {
    const fetchusername = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchusername/${objectId}`
        );
        setusername(response.data.username);
      } catch (error) {
        console.log("Error fetching username:", error);
      }
    };
    fetchusername();
  }, [objectId]);

  useEffect(() => {
    const fetchpfp = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchpfp/${objectId}`
        );
        setprofilepicture(response.data.imageUrl);
      } catch (error) {
        console.log("Error fetching profile picture:", error);
      }
    };
    fetchpfp();
  }, [objectId]);

  useEffect(() => {
    const fetchtitle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchtitle/${objectId}`,
          { withCredentials: true }
        );
        settitle(response.data.title);
      } catch (error) {
        console.log("Error fetching title:", error);
      }
    };
    fetchtitle();
  }, [objectId]);

  useEffect(() => {
    const fetchdescription = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000fetchdescription/${objectId}`,
          { withCredentials: true }
        );
        setdescription(response.data.description);
      } catch (error) {
        console.log("Error fetching description:", error);
      }
    };
    fetchdescription();
  }, [objectId]);

  useEffect(() => {
    const fetchSimilarImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getsimillarimages/${objectId}`
        );
        setSimilarImages(response.data);
      } catch (error) {
        console.error("Error fetching similar images:", error);
      }
    };
    fetchSimilarImages();
  }, [objectId]);

  useEffect(() => {
    const fetchcurentusersusername = async () => {
      const response = await axios.get(
        "http://localhost:5000/fetchcurentusersusername",
        { withCredentials: true }
      );
      setfetchCommentusername(response.data.username);
    };
    fetchcurentusersusername();
  }, []);

  useEffect(() => {
    const fetchcurentusersprofilepicture = async () => {
      const response = await axios.get(
        "http://localhost:5000/fetchcurentusersprofilepicture",
        { withCredentials: true }
      );
      setcurrentusersprofilepicture(response.data.imageUrl);
    };
    fetchcurentusersprofilepicture();
  }, []);

  const handleImageClick = async (imageId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/${imageId}`,
        { withCredentials: true }
      );
      const objectId = response.data.objectId;
      navigate(`/image/${objectId}`);
    } catch (error) {
      console.error("Error handling image click:", error);
    }
  };

  const handlecommentpost = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/putcommentinDB",
        {
          objectId,
          commentinput,
          fetchCommentusername,
          userid,
          currentusersprofilepicture,
        },
        { withCredentials: true }
      );

      const newComment = response.data.newcomment;
      setFetchedComment((prevComments) => [
        ...prevComments,
        {
          input: newComment.commentinput,
          currentusersprofilepicture: newComment.currentusersprofilepicture,
          fetchCommentusername: newComment.fetchCommentusername,
        },
      ]);
      setcommentinput("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    const fetchcomments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/fetchcomments/${objectId}`,
          { withCredentials: true }
        );

        setFetchedComment(
          response.data.map((comment) => ({
            input: comment.commentinput,
            currentusersprofilepicture: comment.currentusersprofilepicture,
            fetchCommentusername: comment.fetchCommentusername,
          }))
        );
      } catch (error) {
        console.log("Error in fetchcomments frontend:", error);
      }
    };

    fetchcomments();
  }, [objectId]);

  const handleusernameclick =async(e)=>{
    navigate(`/${username}/${e}`);
  }

  const commentchange = (e) => {
    setcommentinput(e.target.value);
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  };

  if(!isAuthenticated){
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-start p-4">
          <div className="flex flex-row rounded-[30px] overflow-hidden w-full max-w-screen-lg">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-[500px] h-auto object-cover"
              ref={imageRef}
              onLoad={handleImageLoad}
            />
            <div className="bg-gray-200 w-[500px] flex flex-col justify-between">
              <div className="p-4 flex-grow">
                <div className="flex items-center space-x-3 p-4">
                  <img
                    src={profilepicture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="text-lg  font-semibold cursor-pointer" onClick={handleusernameclick}>{username}</span>
                </div>
                <div className="flex flex-col ml-5 font-sans font-semibold">
                  <span>{title}</span>
                  <span>{description}</span>
                </div>
                <div
                  className="overflow-y-auto bg-white p-4 mt-4 rounded-lg shadow-md"
                  style={{ height: `${imageHeight}px` }}
                >
                  <h2 className="text-lg font-semibold mb-2 ">Comments</h2>
                  <div className="space-y-4">
                    {FetchedComment.length > 0 ? (
                      FetchedComment.map((comment, index) => (
                        <div key={index} className="p-2 border-b flex space-x-4">
                          <img
                            src={comment.currentusersprofilepicture}
                            className="h-9 w-9 rounded-[100px]"
                            alt={`${comment.fetchCommentusername}'s profile`}
                          />
                          <div>
                            <strong>{comment.fetchCommentusername}:</strong>{" "}
                            {comment.input}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
               <div className="font-bold ml-2"> Signup to comment</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center font-sans font-semibold p-3 text-xl">
          More to explore
        </div>
        <div className="columns-1 md:columns-2 lg:columns-5 gap-4 p-5">
          {similarImages.map((image, index) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <div className="block relative group">
                {image.imageUrl && (
                  <>
                    <img
                      className="rounded-xl w-full object-cover cursor-pointer group-hover:brightness-75 transition duration-200"
                      src={image.imageUrl}
                      alt={image.title}
                      onClick={() => handleImageClick(image._id)}
                    />
                    <button className="absolute top-4 right-1 bg-red-600 rounded-[25px] text-white px-5 py-3 opacity-0 group-hover:opacity-100 hover:text-black">
                      Save
                    </button>
                  </>
                )}
                <h1 className="text-base font-semibold mt-2">{image.title}</h1>
                <p>{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-start p-4">
        <div className="flex flex-row rounded-[30px] overflow-hidden w-full max-w-screen-lg">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-[500px] h-auto object-cover"
            ref={imageRef}
            onLoad={handleImageLoad}
          />
          <div className="bg-gray-200 w-[500px] flex flex-col justify-between">
            <div className="p-4 flex-grow">
              <div className="flex items-center space-x-3 p-4">
                <img
                  src={profilepicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-lg font-semibold cursor-pointer" onClick={() => handleusernameclick(objectId)}>{username}</span>
              </div>
              <div className="flex flex-col ml-5 font-sans font-semibold">
                <span>{title}</span>
                <span>{description}</span>
              </div>
              <div
                className="overflow-y-auto bg-white p-4 mt-4 rounded-lg shadow-md"
                style={{ height: `${imageHeight}px` }}
              >
                <h2 className="text-lg font-semibold mb-2 ">Comments</h2>
                <div className="space-y-4">
                  {FetchedComment.length > 0 ? (
                    FetchedComment.map((comment, index) => (
                      <div key={index} className="p-2 border-b flex space-x-4">
                        <img
                          src={comment.currentusersprofilepicture}
                          className="h-9 w-9 rounded-[100px]"
                          alt={`${comment.fetchCommentusername}'s profile`}
                        />
                        <div>
                          <strong>{comment.fetchCommentusername}:</strong>{" "}
                          {comment.input}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  className="flex-grow p-2 border rounded-[27px] border-slate-300"
                  placeholder="Write a comment..."
                  onChange={commentchange}
                  value={commentinput}
                />
                <button
                  className="p-2 bg-red-600 text-white rounded-[27px] font-sans text-[14px] hover:text-black"
                  onClick={handlecommentpost}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center font-sans font-semibold p-3 text-xl">
        More to explore
      </div>
      <div className="columns-1 md:columns-2 lg:columns-5 gap-4 p-5">
        {similarImages.map((image, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <div className="block relative group">
              {image.imageUrl && (
                <>
                  <img
                    className="rounded-xl w-full object-cover cursor-pointer group-hover:brightness-75 transition duration-200"
                    src={image.imageUrl}
                    alt={image.title}
                    onClick={() => handleImageClick(image._id)}
                  />
                  <button className="absolute top-4 right-1 bg-red-600 rounded-[25px] text-white px-5 py-3 opacity-0 group-hover:opacity-100 hover:text-black">
                    Save
                  </button>
                </>
              )}
              <h1 className="text-base font-semibold mt-2">{image.title}</h1>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Image;
