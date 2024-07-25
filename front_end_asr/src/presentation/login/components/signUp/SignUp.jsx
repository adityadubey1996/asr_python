import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClose,
  faIcons,
  faInfo,
  faInfoCircle,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import  {axiosInstance as axios, baseUrl} from 'utils'


import { useNavigate } from "react-router-dom";

const SignUp = ({ setSignIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "password") {
      if (value.length >= 12) {
        setPasswordValid(true);
      } else {
        setPasswordValid(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (formData.email.trim() === "" || formData.password.trim() === "" || formData.password.trim().length < 12 ) {
        setError("Please fill required details")
    } else {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post("/api/signUp", formData);
      if (res.data) {
        setSignIn(true);
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
        {error && (
          <h1 className="text-red-500 text-sm font-medium">
            <FontAwesomeIcon size="sm" icon={faInfoCircle} />
            &nbsp;{error}
          </h1>
        )}
        <TextField
          onChange={handleChange}
          variant="outlined"
          name="password"
          label="Password"
          type="password"
          color={error ? 'error'  : 'success'} 
        />
        {formData.password !== "" && (
          <div className="mt-0 border flex gap-4 items-center justify-center border-gray-300 rounded-sm p-4">
            {passwordValid ? (
              <FontAwesomeIcon icon={faCheck} color="green" />
            ) : (
              <FontAwesomeIcon icon={faXmark} color="red" />
            )}
            <Typography
              variant="body2"
              style={{ fontSize: "14px" }}
              color="GrayText"
            >
              Password should be at least 12 characters.
            </Typography>
          </div>
        )}

        <h1
          onClick={handleSubmit}
          className="cursor-pointer rounded px-5 md:py-4 md:px-20 py-2 overflow-hidden group bg-green-600 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
        >
          <span className="absolute right-0 w-8 md:h-32 h-20 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <center className="relative text-xs uppercase font-medium">
            Register
          </center>
        </h1>
      </form>
      <center onClick={() => setSignIn(true)} className="mt-6 font-medium">
        Already have an account ?{" "}
        <span className="text-green-500 cursor-pointer hover:underline">
          Log In
        </span>
      </center>
    </div>
  );
};

export default SignUp;
