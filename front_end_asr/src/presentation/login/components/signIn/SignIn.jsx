import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import  {axiosInstance as axios, baseUrl} from 'utils'

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginSuccess } from "reducers/auth.reducer";
import {getUserMetrics} from 'reducers/metric.reducer'
import Cookies from "universal-cookie";

const SignUp = ({ setSignIn }) => {
  const cookies = new Cookies();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (formData.email.trim() === "" || formData.password.trim() === "") {
      setError("Required details not filled");
    } else {
      handleSignIn();
    }
  };

  const handleSignIn = async () => {
    try {
      const res = await axios.post(baseUrl() + "/api/signIn", formData);
      if (res.data) {
        dispatch(userLoginSuccess(res.data));
        localStorage.setItem("user", JSON.stringify(res.data));
        cookies.set("auth-token", res.data.data.access_token, { path: "/" });
        dispatch(getUserMetrics()).then((data) => {
console.log('data from handleSignIn', data)
if(data && data.payload && Array.isArray(data.payload) && data.payload.length > 0){
  navigate('/main')
}
else{
  navigate('/questions')
}
        }).catch((e) => {
          console.log('error from handleSignIn', e)
        })
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data.data);
    }
  };

  return (
    <div className="lg:w-[20%]">
      <form
        action=""
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <TextField
          onChange={handleChange}
          variant="outlined"
          name="email"
          label="Email"
          type="email"
          color={error ? 'error'  : 'success'} 
        />
        <TextField
          onChange={handleChange}
          variant="outlined"
          name="password"
          label="Password"
          type="password"
          color={error ? 'error'  : 'success'} 
        />
        <div className="lg:w-[100%]">
          {error && (
            <h1 className="text-red-500 text-sm font-medium">
              <FontAwesomeIcon size="sm" icon={faInfoCircle} />
              &nbsp;{error}
            </h1>
          )}
        </div>
        <h1
          onClick={handleSubmit}
          className="cursor-pointer rounded px-5 md:py-4 md:px-20 py-2 overflow-hidden group bg-green-600 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
        >
          <span className="absolute right-0 w-8 md:h-32 h-20 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <center className="relative text-xs uppercase font-medium">
            Continue
          </center>
        </h1>
      </form>
      <center onClick={() => setSignIn(false)} className="mt-6 font-medium">
        Do not have an account ?{" "}
        <span className="text-green-500 cursor-pointer hover:underline">
          Register
        </span>
      </center>
    </div>
  );
};

export default SignUp;
