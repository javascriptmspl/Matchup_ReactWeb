import { Component, Fragment, useCallback, useEffect, useState } from "react";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import ManageProfileBasicInput from "../component/manage-profile/basic-input";

import { Link, useNavigate } from "react-router-dom";
import ManageProfileLookingFor from "../component/manage-profile/looking-for-input";
import ManageProfileLifeStyle from "../component/manage-profile/lifestyle-input";
import ManageProfilePhysicalInfo from "../component/manage-profile/physical-info";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAsync } from "../../dating/store/slice/profileSlice";
import ManageProfileBio from "../component/manage-profile/bio";
import moment from "moment";
import ContactDetailsInput from "../component/manage-profile/contact-details";
import PersonalDetalsInput from "../component/manage-profile/personal-details";
// import myprofile from "../pagesDating/my-profile"

const initialUserData = {
  description: "bioo",

  name: "William Smith",
  gender: "Woman",
  lookingFor: "Men",
  maritalStatus: "Single",
 
  age: 36,
  address: "mohali",

  email: "",
  phoneNumber: "",


  interest: "Dogs,Cats",
  vocations: "Maldives, Bangladesh",
  relationType: "Serious Relationshiop,Affair",
  smoking: "Casual Smoker",
  language: "English, French, Italian",

  height: "58 ft",
  dob: "07/11/1997",
  Caste:"",
  Religion:"",
  DietPreferences:"",
  weight: "72 kg",
  hairColor: "Black",
  eyeColor: "Brown",
  bodyType: "Lean",
  ethnicity: "Middle Eastern",
};

const ManageProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [activeTab, setActiveTab] = useState("");
  const [userDDDD, setUserDDDDD] = useState();

  const profileData = useSelector((state) => state.profile.userData);
  const dispatch = useDispatch();
  const userData1 = profileData[0];
  const userDatas = localStorage.getItem("userData");
  const userDataObj = JSON.parse(userDatas);
  const userId = userDataObj?.data?.data?._id || null;

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

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    setEditMode(false);
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    setEditMode(true);
  };
 const updateBioData = (updatedBioData) => {
    // Implement the logic to update bio data in the parent component if needed
  };
  const navigate = useNavigate();

  return (
    <Fragment>
      <HeaderFour />

      <div className="group group--single padding-top padding-bottom">
        <div className="group__bottom">
          <div
            className="col-10"
            style={{
              marginLeft: "11%",
            }}
          >
            <Link>
              <button
                className="default-btn reverse "
                onClick={() => navigate(-1)}
              >
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
                      activeTab === "bio" ? "basic-info-manage-ptofile" : ""
                    }`}
                    onClick={() => {
                      handleActiveTab("bio");
                    }}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Bio</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p>{userData1?.description}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group__bottom--left mb-4 group__bottom--left-manage-profile">
                  <div
                    className={`info" ${
                      activeTab === "basicInfo"
                        ? "basic-info-manage-ptofile "
                        : ""
                    }`}
                    onClick={() => {
                      handleActiveTab("basicInfo");
                      setUserDDDDD(userData1);
                    }}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Basic Details</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Name</p>
                            <p className="info-details">{userData1?.name}</p>
                          </li>
                          <li>
                            <p className="info-name">Date Of Birth</p>
                            <p className="info-details">
                              {moment(userData1?.dob).format("DD/MM/YYYY")}
                            </p>
                          </li>
                          <li>
                            <p className="info-name">Gender</p>
                            <p className="info-details">{userData1?.iAm}</p>
                          </li>
                          <li>
                            <p className="info-name">Marital Status</p>
                            <p className="info-details">
                              {userData1?.marital || "Single"}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group__bottom--left mb-4 group__bottom--left-manage-profile">
                  <div
                    className={`info pointer" ${
                      activeTab === "contact" ? "basic-info-manage-ptofile" : ""
                    }`}
                    onClick={() => handleActiveTab("contact")}
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

                <div className="group__bottom--left mb-4 group__bottom--left-manage-profile">
                  <div
                    className={`info pointer" ${
                      activeTab === "personal"
                        ? "basic-info-manage-ptofile"
                        : ""
                    }`}
                    onClick={() => handleActiveTab("personal")}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Personal Details</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Religion</p>
                            <p className="info-details">
                              {userData1?.Religion}
                            </p>
                          </li>
                          <li>
                            <p className="info-name">Caste</p>
                            <p className="info-details">{userData1?.Caste}</p>
                          </li>
                          <li>
                            <p className="info-name">Height</p>
                            <p className="info-details">{userData1?.Height}</p>
                          </li>
                          <li>
                            <p className="info-name">Birth Place</p>
                            <p className="info-details">
                              {userData1?.birthPlace}
                            </p>
                          </li>
                          <li>
                            <p className="info-name">Diet</p>
                            <p className="info-details">
                              {userData1?.DietPreferences}
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
                  {activeTab === "bio" && (
                    <ManageProfileBio
                      userData={userDDDD}
                      updateUserData={updateUserData}
                      editMode={editMode}
                      updateBioData={updateBioData}
                      onUpdateProfile={updateProfileData}
                    />
                  )}
                </div>
                <div className="group__bottom--right">
                  {activeTab === "basicInfo" && (
                    <ManageProfileBasicInput
                      userData={userDDDD}
                      updateUserData={updateUserData}
                      editMode={editMode}
                      getHandle={getHandle}
                      onUpdateProfile={updateProfileData}
                    />
                  )}
                </div>
               
                <div className="group__bottom--right">
                  {activeTab === "contact" && (
                    <ContactDetailsInput
                      userData={userDDDD}
                      updateUserData={updateUserData}
                      editMode={editMode}
                      getHandle={getHandle}
                      onUpdateProfile={updateProfileData} 
                    />
                  )}
                </div>
                <div className="group__bottom--right">
                  {activeTab === "personal" && (
                    <PersonalDetalsInput
                    userData={userDDDD}
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
      <FooterFour />
    </Fragment>
  );
};

export default ManageProfile;
