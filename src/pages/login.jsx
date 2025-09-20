import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import logo from "../assets/images/logo/Matchup-logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSlice,
  sendOtpAsync,
  verifyOtpAsync,
} from "../dating/store/slice/AuthSlice";

import { getKey } from "../utils";
const title = "Welcome to Matchup";

const LogIn = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [otp, setOtpvalue] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [setOtp, setSendotp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.userCreate);

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!forgotPassword) {
      if (!isValidEmailFormat(userEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }
      try {
        await toast.promise(
          dispatch(
            loginSlice({
              email: userEmail,
              password: userPass,
            })
          ),
          {
            loading: "Logging in...",
            success: (response) => {
              console.log(response);
              if (response.payload.isSuccess === true) {
                navigate(`/${getKey()}`);
                return response.message;
              } else {
                console.log(response.message);
              }
            },
            error: (err) => {
              let errorMsg = "please enter correct email or Password";
              if (err && err.message) {
                errorMsg = err.message;
              } else if (typeof err === "object") {
                try {
                  errorMsg = JSON.stringify(err);
                } catch (e) {}
              } else if (typeof err === "string") {
                errorMsg = err;
              }
              toast.error(errorMsg);
              console.error("Login error:", err);
            },
          }
        );
      } catch (err) {}
    }
  };
  const handleForgot = () => {
    setForgotPassword(true);
  };
  const handleSentOtp = async () => {
    if (!isValidEmailFormat(userEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const data = await dispatch(sendOtpAsync({ email: userEmail }));
      if (data.meta.requestStatus === "rejected") {
        toast.error("Enter Valid Email");
        return;
      }
      setSendotp(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    }
  };
  const handleverifyOtp = async () => {
    if (!isValidEmailFormat(userEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!otp) {
      toast.error("Enter OTP. Please");
      return;
    }
    const aa = await dispatch(
      verifyOtpAsync({ otp, token: state.userOtp.data.token })
    );
    if (aa && aa.payload && aa.payload.isSuccess) {
      navigate(`/${getKey()}`);
      toast.success("Login Successfully!");
    } else {
      navigate("/login");
      toast.error("Wrong OTP. Please try again.");
    }
  };

  return (
    <section className="log-reg">
      <div className="top-menu-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-7">
              <div className="logo">
                <Link to="/">
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      height: "35px",
                      width: "100px",
                    }}
                  />
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-5">
              <Link to="/" className="backto-home">
                <i className="fas fa-chevron-left"></i> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="image image-log"></div>
          <div className="col-lg-7">
            <div className="log-reg-inner">
              <div className="section-header inloginp">
                <h2 className="title">{title}</h2>
              </div>
              <div className="main-content inloginp">
                <form onSubmit={handleSubmit} action="#">
                  <div
                    className={`form-group  ${setOtp ? "d-none" : "d-block"}`}
                  >
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      id="item01"
                      value={userEmail}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                      }}
                      placeholder="Enter Your Email *"
                      className={`my-form-control  `}
                    />
                  </div>
                  <div
                    className={`form-group  ${
                      forgotPassword ? "d-none" : "d-block"
                    }`}
                  >
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      id="item02"
                      value={userPass}
                      onChange={(e) => {
                        setUserPass(e.target.value);
                      }}
                      placeholder="Enter Your Password *"
                      className="my-form-control "
                    />
                  </div>
                  {setOtp && (
                    <div className="form-group">
                      <label>OTP</label>
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtpvalue(e.target.value)}
                        //  onBlur={formik.handleBlur}
                        placeholder="Enter Your otp *"
                        className="my-form-control"
                      />
                    </div>
                  )}
                  <p
                    className={`f-pass ${
                      forgotPassword ? "d-none" : "d-block"
                    }  `}
                    style={{ cursor: "pointer" }}
                    onClick={handleForgot}
                  >
                    Login with OTP
                  </p>
                  {forgotPassword ? (
                    <>
                      <button
                        type="button"
                        className={`default-btn ${
                          setOtp ? "d-none" : "d-block"
                        }`}
                        onClick={handleSentOtp}
                      >
                        <span>Send OTP</span>
                      </button>
                      {setOtp && (
                        <span style={{ display: "flex" }}>
                          Didn't get the code?{" "}
                          <p
                            className={`f-pass ${
                              setOtp ? "d-block" : "d-none"
                            }'}  `}
                            style={{ cursor: "pointer", color: "#00afff" }}
                            onClick={handleSentOtp}
                          >
                            {" "}
                            Resend Otp{" "}
                          </p>
                        </span>
                      )}
                      <button
                        type="button"
                        className={`default-btn ${
                          setOtp ? "d-block" : "d-none"
                        }`}
                        onClick={handleverifyOtp}
                      >
                        <span>Login</span>
                      </button>
                      <p
                        className="f-pass"
                        style={{ cursor: "pointer", marginTop: "10px" }}
                        onClick={() => setForgotPassword(false)}
                      >
                        Use password instead
                      </p>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="default-btn"
                      onClick={handleSubmit}
                    >
                      <span>Sign In</span>
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
};

export default LogIn;
