import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="p-5 sticky border h-20 border-gray-800 top-0">
      <div className="flex justify-end">
        <div className="flex items-center gap-6 justify-center">
          <img
            src={`${user?.userData?.profile_picture}`}
            className="rounded-full"
            width={30}
            alt="profile pic"
          ></img>
          <h1 className="font-bold text-gray-200">{user?.userData?.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
