import { Component, Fragment, useCallback, useEffect, useState } from "react";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import ManageProfileBasicInput from "../component/manage-profile/basic-input";

import { Link } from "react-router-dom";
import ManageProfileLookingFor from "../component/manage-profile/looking-for-input";
import ManageProfileLifeStyle from "../component/manage-profile/lifestyle-input";
import ManageProfilePhysicalInfo from "../component/manage-profile/physical-info";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAsync } from "../store/slice/profileSlice";
import myprofile from "../pagesDating/my-profile";

const initialUserData = {
  name: "William Smith",
  gender: "Woman",
  lookingFor: "Men",
  maritalStatus: "Single",
  dob: "07/11/1997",
  age: 36,
  address: "mohali",

  iAmLookingFor: "I want a funny person",
  ILike: "I like to travel a lot",

  interest: "Dogs,Cats",
  vocations: "Maldives, Bangladesh",
  relationType: "Serious Relationshiop,Affair",
  smoking: "Casual Smoker",
  language: "English, French, Italian",

  height: "58 ft",
  weight: "72 kg",
  hairColor: "Black",
  eyeColor: "Brown",
  bodyType: "Lean",
  ethnicity: "Middle Eastern",
};

const ManageProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [userDDDD, setUserDDDDD] = useState();

  const profileData = useSelector((state) => state.profile?.userData);
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

  useEffect(() => {
    if (profileData) {
      // Handle both array and object formats
      const userProfileData = Array.isArray(profileData)
        ? profileData[0]
        : profileData;
      if (userProfileData) {
        setUserData(userProfileData);
        setUserDDDDD(userProfileData);
      }
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

  const refreshProfile = () => {
    dispatch(getUserProfileAsync(userId));
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
                      activeTab === "basicInfo1"
                        ? "basic-info-manage-ptofile "
                        : ""
                    }`}
                    onClick={() => {
                      handleActiveTab("basicInfo1");
                      setUserDDDDD(userData1);
                    }}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Basic Info</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Name</p>
                            <p className="info-details">{userData1?.name}</p>
                          </li>
                          <li>
                            <p className="info-name">I'm a</p>
                            <p className="info-details">{userData1?.iAm}</p>
                          </li>
                          <li>
                            <p className="info-name">Looking for a</p>
                            <p className="info-details">{userData1?.looking}</p>
                          </li>
                          <li>
                            <p className="info-name">Marital Status</p>
                            <p className="info-details">
                              {userData1?.marital || "Single"}
                            </p>
                          </li>

                          <li>
                            <p className="info-name">Date of Birth</p>
                            <p className="info-details">{userData1?.dob}</p>
                          </li>
                          <li>
                            <p className="info-name">Address</p>
                            <p className="info-details">{userData1?.address}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group__bottom--left mb-4 group__bottom--left-manage-profile">
                  <div
                    className={`info pointer" ${
                      activeTab === "lookingFor"
                        ? "basic-info-manage-ptofile"
                        : ""
                    }`}
                    onClick={() => handleActiveTab("lookingFor")}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Looking For</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">I'm looking for</p>
                            <p className="info-details">{userData1?.looking}</p>
                          </li>
                          <li>
                            <p className="info-name">Whatever I like</p>
                            <p className="info-details">{userData1.ILike}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group__bottom--left mb-4 group__bottom--left-manage-profile">
                  <div
                    className={`info pointer" ${
                      activeTab === "lifeStyle"
                        ? "basic-info-manage-ptofile"
                        : ""
                    }`}
                    onClick={() => handleActiveTab("lifeStyle")}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Lifestyle</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Interest</p>
                            <p className="info-details">
                              {Array.isArray(userData.interest)
                                ? userData.interest
                                    .map((item) => item.name || item)
                                    .join(", ")
                                : userData.interest || "No interests"}
                            </p>
                          </li>
                          <li>
                            <p className="info-name">Favorite vocations</p>
                            <p className="info-details">{userData.vocations}</p>
                          </li>
                          <li>
                            <p className="info-name">Looking for</p>
                            <p className="info-details">
                              {userData.relationType}
                            </p>
                          </li>
                          <li>
                            <p className="info-name">Smoking</p>
                            <p className="info-details">{userData.smoking}</p>
                          </li>
                          <li>
                            <p className="info-name">Language</p>
                            <p className="info-details">{userData.language}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group__bottom--left mb-4 group__bottom--left-manage-profile">
                  <div
                    className={`info pointer" ${
                      activeTab === "physicalInfo"
                        ? "basic-info-manage-ptofile"
                        : ""
                    }`}
                    onClick={() => handleActiveTab("physicalInfo")}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Physical Info</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Height</p>
                            <p className="info-details">{userData.height}</p>
                          </li>
                          <li>
                            <p className="info-name">Weight</p>
                            <p className="info-details">{userData.weight}</p>
                          </li>
                          <li>
                            <p className="info-name">Hair Color</p>
                            <p className="info-details">{userData.hairColor}</p>
                          </li>
                          <li>
                            <p className="info-name">Eye Color</p>
                            <p className="info-details">{userData.eyeColor}</p>
                          </li>
                          <li>
                            <p className="info-name">Body Type</p>
                            <p className="info-details">{userData.bodyType}</p>
                          </li>
                          <li>
                            <p className="info-name">Ethnicity</p>
                            <p className="info-details">{userData.ethnicity}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 order-xl-1">
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
                  {activeTab === "basicInfo1" && (
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
                  {activeTab === "lookingFor" && (
                    <ManageProfileLookingFor
                      userData={userData}
                      updateUserData={updateUserData}
                      editMode={editMode}
                      onUpdateProfile={updateProfileData}
                    />
                  )}
                </div>
                <div className="group__bottom--right">
                  {activeTab === "lifeStyle" && (
                    <ManageProfileLifeStyle
                      userData={userData}
                      updateUserData={updateUserData}
                      editMode={editMode}
                      onUpdateProfile={updateProfileData}
                    />
                  )}
                </div>
                <div className="group__bottom--right">
                  {activeTab === "physicalInfo" && (
                    <ManageProfilePhysicalInfo
                      userData={userData}
                      updateUserData={updateUserData}
                      editMode={editMode}
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
