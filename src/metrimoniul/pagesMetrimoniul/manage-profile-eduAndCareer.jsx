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
import ManageProfileEduAndCareerInput from "../component/manage-profile/educationAndCareer-input";


const ManageProfileCareerAndEducation = () => {
  const [editMode, setEditMode] = useState(false);
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
                      activeTab === "edu&career"
                        ? "basic-info-manage-ptofile "
                        : ""
                    }`}
                    onClick={() => {
                      handleActiveTab("edu&career");
                      setUserDDDDD(userData1);
                    }}
                  >
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Education & Career</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Profession</p>
                            <p className="info-details">{userData1?.occupation}</p>
                          </li>
                          {/* <li>
                            <p className="info-name">Company Name</p>
                            <p className="info-details">{userData1?.CompanyName}</p>
                          </li> */}
                          <li>
                            <p className="info-name">Annual Income</p>
                            <p className="info-details">{userData1?.salary}</p>
                          </li>
                          <li>
                            <p className="info-name">Highest Qualification</p>
                            <p className="info-details">
                              {userData1?.HighestQualification}
                            </p>
                          </li>
                          <li>
                            <p className="info-name">Education</p>
                            <p className="info-details">
                              {userData1?.education}
                            </p>
                          </li>
                          {/* <li>
                            <p className="info-name">University</p>
                            <p className="info-details">
                              {userData1?.CollageName}
                            </p>
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 order-xl-1">
                
                <div className="group__bottom--right">
                  {activeTab === "edu&career" && (
                    <ManageProfileEduAndCareerInput
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

export default ManageProfileCareerAndEducation;
