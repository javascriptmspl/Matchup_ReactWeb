import React from "react";
import { Component, Fragment, useCallback, useEffect, useState } from "react";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import ManageProfileBasicInput from "../component/manage-profile/basic-input";
import ManageProfileContactInput from "../component/manage-profile/Contact-input";
import { Link } from "react-router-dom";
import ManageProfileLookingFor from "../component/manage-profile/looking-for-input";
import ManageProfileLifeStyle from "../component/manage-profile/lifestyle-input";
import ManageProfilePhysicalInfo from "../component/manage-profile/physical-info";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAsync } from "../store/slice/profileSlice";

const initialUserData = {
  email: "",
  phoneNumber: "",
};
const ContactDetail = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [activeTab, setActiveTab] = useState("Contact-info");

  const profileData = useSelector((state) => state.profile?.userData) || [];
  const dispatch = useDispatch();
  const userData1 = profileData;
  const userDatas = localStorage.getItem("userData");
  const userDataObj = userDatas ? JSON.parse(userDatas) : null;
  const userId = userDataObj?.data?._id || null;

  const getHandle = useCallback(() => {
    dispatch(getUserProfileAsync(userId));
  }, [dispatch, userId]);

  const updateProfileData = useCallback(async () => {
    try {
      dispatch(getUserProfileAsync(userId));
    } catch (error) {
      console.error("Error updating user profile in ManageProfile:", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    getHandle();
  }, [getHandle]);

  // Update userData when profileData changes
  useEffect(() => {
    if (profileData && profileData.length > 0) {
      setUserData(profileData[0]);
    }
  }, [profileData]);

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    setEditMode(false);
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    setEditMode(true);
  };
  return (
    <Fragment>
      <HeaderFour />
      <div className="group group--single padding-top">
        <div className="group__bottom">
          <div
            className="col-10"
            style={{
              marginLeft: "11%",
            }}
          >
            <Link to="/dating/profile">
              <button className="default-btn reverse ">
                <span>Back</span>
              </button>
            </Link>
          </div>
          <div className="container">
            <div className="row g-4">
              <div className="col-xl-6 order-xl-1">
                <div className="group__bottom--left mb-4 group__bottom--left-manage-profile">
                  <div
                    className={`info" ${
                      activeTab === "Contact-info"
                        ? "Contact-info-ContactDetail "
                        : ""
                    }`}
                    onClick={() => {
                      handleActiveTab("Contact-info");
                      //  setUserData(userData);
                      setEditMode(true);
                    }}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Contact Details</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Email</p>
                            <p className="info-details">{userData1?.email}</p>
                          </li>
                          <li>
                            <p className="info-name">Phone</p>
                            <p className="info-details">
                              {userData1?.phoneNumber}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 order-xl-1">
                <div className="group__bottom--right">
                  {activeTab === "Contact-info" && (
                    <ManageProfileContactInput
                      userData={userData1}
                      updateUserData={updateUserData}
                      editMode={editMode}
                      getHandle={getHandle}
                      onUpdateProfile={updateProfileData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ContactDetail;
