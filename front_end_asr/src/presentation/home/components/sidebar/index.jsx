import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faHome,
  faMoneyBill,
  faPerson,
  faSignOut,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarItems } from "utils";
// import { userLogout } from "";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedItem, setSelectedItem }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // dispatch(userLogout());
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const user = useSelector((state) => state?.user?.useData);

  const handleItemClick = (item) => {
    setSelectedItem(item.title);
    navigate(`/${item.title.toLowerCase()}`);  // This assumes your route names match the sidebar titles
  };

  return (
    <div className="bg-gray-900">
      <div className="border h-screen flex flex-col gap-5 border-gray-800">
        <div>
          <h1 className="font-bold px-5 pt-8 pb-1 font-sans text-gray-100 lg:text-lg">
            {" "}
            Private Workspace
          </h1>
          <h1 className="font-medium text-xs px-5 text-gray-300">
            {user?.email}
          </h1>
        </div>
        <div className="grid gap-2">
          {/* {sidebarItems.map((x, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(x)}
              className="flex hover:bg-gray-800 py-3 px-4 cursor-pointer items-center"
            >
              <span
                className={
                  selectedItem === x.title
                    ? "text-gray-300"
                    : "text-gray-300"
                }
                style={{ width: "2rem" }}
              >
                {x.icon}
              </span>
              <div
                className={
                  selectedItem === x.title
                    ? "text-gray-100 font-sans font-bold"
                    : "text-gray-300 font-sans"
                }
              >
                {x.title}
              </div>
            </div>
          ))} */}
             {sidebarItems.map((item, index) => (
        <div key={index} onClick={() => handleItemClick(item)} className={`hover:bg-gray-800 p-3 cursor-pointer flex items-center ${selectedItem === item.title ? "text-white font-bold" : "text-gray-300"}`}>
          <FontAwesomeIcon icon={item.icon} className="mr-2" />
          <span>{item.title}</span>
        </div>
      ))}
        </div>
        <h1
          onClick={() => handleLogout()}
          className="p-5 cursor-pointer font-semibold text-red-500 mt-20"
        >
          Logout &nbsp; <FontAwesomeIcon icon={faSignOut} />
        </h1>
      </div>
    </div>
  );
};

export default Sidebar;
