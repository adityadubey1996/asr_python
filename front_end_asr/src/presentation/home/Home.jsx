import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar/index";
import RightSideBar from './components/rightSideBar/index'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faHome,
  faMoneyBill,
  faPerson,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { constants } from "utils";


const Home = ({defaultItem}) => {

  const [selectedItem, setSelectedItem] = useState(
    constants.SIDEBAR_TRANSCRIPTIONS
  );
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

  }, []);
  return (
    <div className="flex flex-row bg-gray-900">
      <Sidebar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <RightSideBar selectedItem={selectedItem}/>
    </div> 
  );
};

export default Home;
