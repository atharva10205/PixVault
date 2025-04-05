import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Accounts = () => {
  const navigate = useNavigate();
  const { input } = useParams();
  const [accounts, setAccounts] = useState([]);


  useEffect(() => {
    const importListOfSearched = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/import_list_of_searched/${input}`,
          { withCredentials: true }
        );
        console.log(response.data);
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    importListOfSearched();
  }, [input]);

  const navigateToMedia = () => {
    navigate(`/search/${input}`);
  };

  const handleAccountClick = (username, _id) => {

    // const get_correct_userID = async()=>{
    //   const response = await axios.get(`http://localhost:5000/get_correct_userID/${_id}`)
    //   console.log(response)
    //   await navigate(`/UserProfile_/${username}/${response.data._id}`);

    // }
    // get_correct_userID();

    navigate(`/UserProfile_/${username}/${_id}`)
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Navigation Tabs */}
      <div className="text-white flex align-middle cursor-pointer justify-center gap-10 pt-2">
        <div
          onClick={navigateToMedia}
          className={`cursor-pointer ${
            location.pathname.startsWith("/search")
              ? "underline decoration-[3px] decoration-yellow-400"
              : ""
          }`}
        >
          Media
        </div>

        <div
          className={`cursor-pointer ${
            location.pathname.startsWith("/Account")
              ? "underline decoration-[3px] decoration-yellow-400"
              : ""
          }`}
        >
          Accounts
        </div>
      </div>

      {/* Display fetched usernames */}
      <div className="text-white p-4">
        <h2 className="text-xl font-bold">Accounts List</h2>
        <ul className="mt-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <li
                key={account._id}
                className="p-3 cursor-pointer border-b border-yellow-400"
                onClick={() => handleAccountClick(account.username, account._id)}
              >
                {account.username ? account.username : "No Username Available"}
              </li>
            ))
          ) : (
            <p>No accounts found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Accounts;
