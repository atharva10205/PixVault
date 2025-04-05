import "./App.css";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Created from "./components/Created";
import Save from "./components/Save";
import Create from "./components/Create";
import Home from "./components/Home";
import Explore from "./components/Explore";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Image from "./components/Image";
import Searchedimages from "./components/Searchedimages";
import Anime from "./components/Anime";
import Cat from "./components/Cat";
import Car from "./components/Car";
import Food from "./components/Food";
import Nature from "./components/Nature";
import Tech from "./components/Tech";
import Userprofile from "./components/Userprofile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Chatlist from "./components/Chatlist";
import Chate from "./components/Chate";
import Accounts from "./components/Accounts";
import Userprofile1 from "./components/Userprofile1";
import Videocall from "./components/Videocall";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/Home" replace />,
    },
    {
      path: "/Profile",
      element: <Profile />,
    },
    {
      path: "/Created",
      element: <Created />,
    },
    {
      path: "/save",
      element: <Save />,
    },
    {
      path: "/Create",
      element: <Create />,
    },
    {
      path: "/Home",
      element: <Home />,
    },
    {
      path: "/Explore",
      element: <Explore />,
    },
    {
      path: "/Signup",
      element: <Signup />,
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/image/:objectId",
      element: <Image />,
    },
    {
      path: "/search/:input",
      element: <Searchedimages />,
    },
    {
      path: "/Anime",
      element: <Anime />,
    },
    {
      path: "/Car",
      element: <Car />,
    },
    {
      path: "/Food",
      element: <Food />,
    },
    {
      path: "/Cat",
      element: <Cat />,
    },
    {
      path: "/Nature",
      element: <Nature />,
    },
    {
      path: "/Tech",
      element: <Tech />,
    },
    {
      path: "/:username/:e",
      element: <Userprofile />,
    },
    {
      path: "/UserProfile_/:username/:userId",
      element: <Userprofile1 />,
    },
    {
      path: "/chatlist",
      element: <Chatlist />,
    },
    {
      path: "/chate/:followerId",
      element: <Chate />,
    },
    {
      path: "/Account/:input",
      element: <Accounts />,
    },
     {
      path: "/Videocall/:followerId/:currentuserID",
      element: <Videocall />,
    },
  ]);

  return (
    <GoogleOAuthProvider clientId="132470259782-f8a4lj20clpmoj086gb17abk13mv8r8d.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;
