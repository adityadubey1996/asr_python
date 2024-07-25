import React, { useEffect } from "react";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import  {axiosInstance as axios, baseUrl} from 'utils'

import { useDispatch } from "react-redux";
import { userLoginFailure, userLoginSuccess } from "reducers/auth.reducer";
import { getUserMetrics,  } from "reducers/metric.reducer";


import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Google = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const onSuccessResponse = async (res) => {
    console.log('res from onSuccessResponse', res.tokenId)
    axios
      .post(baseUrl() + "/api/google-login", { tokenId: res.tokenId })
      .then((res) => {
        dispatch(userLoginSuccess(res.data));
        localStorage.setItem("user", JSON.stringify(res.data));
        cookies.set("auth-token", res.data.data.access_token, { path: "/" });
        console.log('res.data.data.access_token', res.data.data.access_token)
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
      })
      .catch((err) => {console.log(err)
      dispatch(userLoginFailure(err))
      });
  };
  const onFailureResponse = (res) => {
    if (res.error === "popup_closed_by_user") {
      console.log("User closed the Google authentication popup");
    } else {
      console.error("Google authentication failed:", res.error);
    }
  };

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        plugin_name: "chat",
      });
    });
  });

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Sign in with Google"
        onSuccess={onSuccessResponse}
        onFailure={onFailureResponse}
        style={{ width: "400px" }}
      />
    </div>
  );
};

export default Google;
