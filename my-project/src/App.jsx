import './App.css'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import Created from './components/Created'
import Save from './components/Save'
import Create from './components/Create'
import Home from './components/Home'
import Explore from './components/Explore'
import{ createBrowserRouter, RouterProvider}from'react-router-dom'
import Signup from './auth/Signup'
import Login from './auth/Login'
import Image from './components/Image'
import Searchedimages from './components/Searchedimages'
import Anime from './components/Anime'
import Cat from './components/Cat'
import Car from './components/Car'
import Food from './components/Food'
import Nature from './components/Nature'
import Tech from './components/Tech'
import Userprofile from './components/Userprofile'


function App() {


  const router = createBrowserRouter([
    
    {
      path:"/Profile",
      element:<Profile />
    },
    {
      path:"/",
      element:<Navbar/>,
    },
    {
      path:"/Created",
      element:<Created />
    },
    {
      path:"/save",
      element:<Save/>

    },
    {
      path: '/Create',
      element: <Create  />,
    },
    {
      path: '/Home',
      element: <Home />, 
    },
    {
      path:"/Explore",
      element:<Explore/>

    }, {
      path:"/Signup",
      element:<Signup/>

    }, {
      path:"/Login",
      element:<Login/>

    },
    {
      path: "/image/:objectId",
      element: <Image />
    }, {
      path: "/search/:input",
      element: <Searchedimages />
    },{
      path: "/Anime",
      element: <Anime />
    },{
      path: "/Car",
      element: <Car /> 
    },
    {
      path: "/Food",
      element: <Food/> 
    },
    {
      path: "/Cat",
      element: <Cat /> 
    },
    {
      path: "/Nature",
      element: <Nature /> 
    },
    {
      path: "/Tech",
      element: <Tech /> 
    },{
      path: '/:username/:e',
      element: <Userprofile />,
    },
    
  ])

  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App
