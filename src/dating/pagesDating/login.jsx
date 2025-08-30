import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import logo from "../assets/images/logo/Logo-light-pink.png";

const title = "Welcome to Matchup";
const otherTitle = "Sign up with your email";

const LogIn = () => {
  const [userEmail, setUserEmail] = useState("Matchup@gmail.com");
  const [userPass, setUserPass] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginAsync = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (
            userEmail === "Matchupdating@gmail.com" &&
            userPass === "123456"
          ) {
            resolve("Login successful");
          } else {
            reject("Incorrect username or password");
          }
        }, 500);
      });
    };

    try {
      const result = await toast.promise(loginAsync(), {
        loading: "Logging in...",
        success: (message) => {
          localStorage.setItem("username", userEmail);
          navigate("/");
          return message;
        },
        error: (error) => {
          return error;
        },
      });

      console.log(result);
    } catch (error) {
      console.error(error);
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
                  <div className="form-group">
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
                      className="my-form-control"
                    />
                  </div>
                  <div className="form-group">
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
                      className="my-form-control"
                    />
                  </div>
                  <p className="f-pass">
                    Forgot your password? <a href="#">recover password</a>
                  </p>
                  <div className="text-center">
                    <button type="submit" className="default-btn">
                      <span>Sign In</span>
                    </button>
                  </div>
                  <div className="or">
                    <p>OR</p>
                  </div>
                  <div className="or-content">
                    <p>{otherTitle}</p>
                    <a href="#" className="default-btn reverse">
                      <img src="assets/images/login/google.png" alt="google" />{" "}
                      <span>Sign Up with Google</span>
                    </a>
                    <p className="or-signup">
                      {" "}
                      Don't have an account?{" "}
                      <Link to="/register">Sign up here</Link>
                    </p>
                  </div>
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
