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
import ManageProfileFamilyInput from "../component/manage-profile/ManageProfileFamilyInput";
// import myprofile from "../pagesDating/my-profile"

const initialUserData = {
  bio: "bioo",

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

const ManageProfileFamily = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [activeTab, setActiveTab] = useState("bio");
  const [userDDDD, setUserDDDDD] = useState();

  const profileData = useSelector((state) => state.profile?.userData);
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

  const navigate = useNavigate();

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
                      activeTab === "Family" ? "basic-info-manage-ptofile" : ""
                    }`}
                    onClick={() => {
                      handleActiveTab("Family");
                      setUserDDDDD(userData1);
                    }}
                  >
                      <div
                          className="tab-pane fade show  "
                          id="gt6"
                          role="tabpanel"
                          aria-labelledby="gt6-tab"
                        >
                          <div className="info">
                            <div className="info-card mb-4">
                              <div className="info-card-title">
                                <h6>
                                  Family Details{" "}
                                  <span>
                                    <Link
                                      to="/metrimonial/manage-profile-family"
                                      style={{
                                        float: "right",
                                      }}
                                    >
                                      <i
                                        class="fa fa-pencil"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Edit
                                    </Link>
                                  </span>{" "}
                                </h6>
                              </div>

                              <div className="info-card-content">
                                <ul className="info-list">
                                  <li>
                                    <p className="info-name">Family Status</p>
                                    <p className="info-details">{userData1?.familyStatus}</p>
                                  </li>
                                  <li>
                                    <p className="info-name">Father’s Name</p>
                                    <p className="info-details">
                                      {userData1?.FathersName}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Father’s Status</p>
                                    <p className="info-details">{userData1?.FathersStatus}</p>
                                  </li>
                                  <li>
                                    <p className="info-name">Mother’s Name</p>
                                    <p className="info-details">
                                      {userData1?.MothersName}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Mother’s Status</p>
                                    <p className="info-details">
                                      {userData1?.MothersStatus}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">No of Brother</p>
                                    <p className="info-details">
                                      {userData1?.NumberOfBrother}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Married</p>
                                    <p className="info-details">
                                      {userData1?.NoOfMarriedBrother}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">No. of Sister</p>
                                    <p className="info-details">
                                      {userData1?.NumberOfSister}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Married</p>
                                    <p className="info-details">
                                      {userData1?.NoOfMarriedSister}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                    
                  </div>
                </div>
              </div>

              <div className="col-xl-6 order-xl-1">
                {/* <div className="group__bottom--right">
                  {activeTab === "bio" && (
                    <ManageProfileBio
                      // userData={userDDDD}
                      updateUserData={updateUserData}
                      editMode={editMode}
                      getHandle={getHandle}
                      onUpdateProfile={updateProfileData}
                    />
                  )}
                </div> */}
                <div className="group__bottom--right">
                  {activeTab === "Family" && (
                    <ManageProfileFamilyInput
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

export default ManageProfileFamily;
