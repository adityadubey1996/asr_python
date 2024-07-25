import React, { useState } from "react";
import Google from "./components/Google";
import SignIn from "./components/signIn/SignIn";
import SignUp from "./components/signUp/SignUp";
import { Divider, Grid } from "@mui/material";

const Login = () => {
  const [signIn, setSignIn] = useState(false);

  return (
    <div className="lg:w-screen">
      <div className="justify-center items-center flex h-[80vh] flex-col">
        <h1 className="font-bold text-[26px] mb-16">Create Your account</h1>
        {signIn ? (
          <SignIn setSignIn={setSignIn} />
        ) : (
          <SignUp setSignIn={setSignIn} />
        )}
        <br />
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <Divider sx={{ width: "120px", height: "2px" }} />
          </Grid>
          <Grid item>
            <span style={{ margin: "0 10px" }}>or</span>
          </Grid>
          <Grid item>
            <Divider sx={{ width: "120px", height: "2px" }} />
          </Grid>
        </Grid>
        <br />
        <Google />
      </div>
    </div>
  );
};

export default Login;
