import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../component/layout/pageheader";
import ActiveMember from "../component/sidebar/member";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";
import InstallApp from "../component/popUps/installApp";
import BlockUserModal from "../component/popUps/client";
import ShareUserProfileModal from "../component/popUps/ShareUserProfileModal";
import ReportUserModal from "../component/popUps/reportUserModal";
import CheckCompatibilityModal from "../component/popUps/checkCompatibilty"
import RelationshipMilestoneTracker from "../component/popUps/MildStoneModal";
import { UserData } from "../..//assets/DummyData/userData";
import { useDispatch, useSelector } from "react-redux";
import userMale from "../../dating//assets/images/myCollection/user-male.jpg";
import { getByIdUsersAsync } from "../store/slice/AuthSlice";
import { BASE_URL } from "../../base";


const name = "William Smith";
const activety = "Active 3 Days Ago";
const desc =
  "Challenges are whats make lifes interesting and overcoming them is what makes life meaningful";



const UserProfile = () => {
const [mildStone, setMildStone] = useState(false);
  const [loading, setLoading] = useState(true);

  const { _id } = useParams();
  const dispatch = useDispatch();

  const USER_GET_BY_ID = useSelector((state) => state?.userCreate?.user);
  console.log("userrrprofilesss",USER_GET_BY_ID)
  
  const USER_PROFILE = USER_GET_BY_ID;
  console.log("userrrprofile",USER_PROFILE)

  const calculatedAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    dispatch(getByIdUsersAsync(_id));
    try {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(true);
    }
  }, [dispatch, _id]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [_id]);



  

    

  const interests = [
    "Traveling",
    "Reading",
    "Cooking",
    "Sports",
    "Music",
    "Photography"
  ]
  return (
    <Fragment>
      <HeaderFour />
      <PageHeader />
      <div className="group group--single padding-bottom">
            <div className="group__top">
              <div className="container">
                <div className="row">
                  <div className="col-xl-3 d-none d-xl-block"></div>
                  <div className="col-xl-9">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="gt1-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#gt1"
                          type="button"
                          role="tab"
                          aria-controls="gt1"
                          aria-selected="true"
                        >
                          <i className="fa-solid fa-user"></i> About{" "}
                        </button>
                      </li>

                      {/* <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="gt2-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#gt2"
                          type="button"
                          role="tab"
                          aria-controls="gt2"
                          aria-selected="true"
                        >
                          <i className="fa-solid fa-user"></i> Edu & Career{" "}
                        </button>
                      </li> */}

                      {/* <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="gt3-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#gt3"
                          type="button"
                          role="tab"
                          aria-controls="gt3"
                          aria-selected="false"
                        >
                          <i className="fa-solid fa-photo-film"></i> Family{" "}
                        </button>
                      </li> */}

                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="gt4-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#gt4"
                          type="button"
                          role="tab"
                          aria-controls="gt4"
                          aria-selected="false"
                        >
                          <i className="fa-solid fa-photo-film"></i> Media{" "}
                          <span>06</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="group__bottom">
              <div className="container">
                <div className="row g-4">
                  <div className="col-xl-6 order-xl-1">
                    <div className="group__bottom--left">
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="gt1"
                          role="tabpanel"
                          aria-labelledby="gt1-tab"
                        >
                          <div className="info">
                            <div className="info-card mb-4">
                              <div className="info-card-title">
                                <h6>Bio</h6>
                              </div>
                              <div className="info-card-content">
                                <p>
                                  I am {USER_PROFILE?.name || "girl"}{" "}
                                  {USER_PROFILE
                                    ? calculatedAge(USER_PROFILE?.dob)
                                    : ""}{" "}
                                  with a zest for life and a belief in the
                                  beauty of companionship. Grounded in family
                                  values, I find joy in simple pleasures and
                                  seek a life partner who shares similar values
                                  and is ready to embark on the journey of
                                  building a fulfilling life together. If you
                                  value love, laughter, and creating meaningful
                                  connections, I'm excited about the possibility
                                  of sharing those moments with you.
                                </p>
                              </div>
                            </div>

                            <div className="info-card mb-4">
                              <div className="info-card-title">
                                <h6>Basic Details</h6>
                              </div>
                              <div className="info-card-content">
                                <div className="row text-center"></div>
                                <ul className="info-list">
                                  <li>
                                    <p className="info-name"> Created by</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.createdBy || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name"> Age</p>
                                    <p className="info-details">
                                      {USER_PROFILE
                                        ? calculatedAge(USER_PROFILE?.dob)
                                        : ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name"> Height</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.Height || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Date of Birth</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.dob || ""}
                                    </p>
                                  </li>

                                  <li>
                                    <p className="info-name">Marital Status</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.marital || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Lives in</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.address || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">
                                      Religion & Mother Tongue
                                    </p>
                                    <p className="info-details">
                                      {USER_PROFILE?.Religion || "Hindu, Hindi"}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Community</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.community || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">
                                      Diet Preferences
                                    </p>
                                    <p className="info-details">
                                      {USER_PROFILE?.DietPreferences || ""}
                                    </p>
                                  </li>
                                  {/* <li>
                                <p className="info-name">Gender</p>
                                <p className="info-details">{USER_PROFILE?.iAm || ""}</p>
                              </li>
                              <li>
                                <p className="info-name">Loking for a</p>
                                <p className="info-details">{USER_PROFILE?.looking || ""}</p>
                              </li>
                              */}
                                </ul>
                              </div>
                            </div>

                            <div className="info-card mb-4">
                              <div className="info-card-title">
                                <h6>Contact Details</h6>
                              </div>
                              <div className="info-card-content">
                                <div className="row text-center"></div>
                                <ul className="info-list">
                                  <li>
                                    <p className="info-name">Contact Number</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.contact || "9874563210"}
                                    </p>
                                  </li>

                                  <li>
                                    <p className="info-name">Email ID</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.email || ""}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <div
                          className="tab-pane fade show active"
                          id="gt2"
                          role="tabpanel"
                          aria-labelledby="gt2-tab"
                        >
                          <div className="info">
                            <div className="info-card mb-4">
                              <div className="info-card-title">
                                <h6>Career & Education </h6>
                              </div>
                              <div className="info-card-content">
                                <ul className="info-list">
                                  <li>
                                    <p className="info-name">Profession</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.occupation || ""}
                                    </p>
                                  </li>

                                  <li>
                                    <p className="info-name">Company Name</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.companyName || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Annual Income</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.salary || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">
                                      Highest Qualification
                                    </p>
                                    <p className="info-details">
                                      {USER_PROFILE?.highEdu || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Education</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.education || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Collage Name</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.clgName || ""}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div> */}

                        {/* <div
                          className="tab-pane fade show active"
                          id="gt3"
                          role="tabpanel"
                          aria-labelledby="gt3-tab"
                        >
                          <div className="info">
                            <div className="info-card mb-4">
                              <div className="info-card-title">
                                <h6>Family Details</h6>
                              </div>
                              <div className="info-card-content">
                                <ul className="info-list">
                                  <li>
                                    <p className="info-name">Family Status</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.familyStatus || ""}
                                    </p>
                                  </li>

                                  <li>
                                    <p className="info-name">Father’s Status</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.fatherStatus || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">Mother’s Status</p>
                                    <p className="info-details">
                                      {USER_PROFILE?.motherStatus || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">
                                      Number of Brother
                                    </p>
                                    <p className="info-details">
                                      {USER_PROFILE?.numberofBrother || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">
                                      No of Married Brother
                                    </p>
                                    <p className="info-details">
                                      {USER_PROFILE?.witchMaridBrother ||
                                        ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">
                                      Number of Sister
                                    </p>
                                    <p className="info-details">
                                      {USER_PROFILE?.numberofSister || ""}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="info-name">
                                      Number of Sister
                                    </p>
                                    <p className="info-details">
                                      {USER_PROFILE?.witchMaridSister || ""}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div> */}

                        <div
                          className="tab-pane fade"
                          id="gt4"
                          role="tabpanel"
                          aria-labelledby="gt4-tab"
                        >
                          <div className="group__bottom--body bg-white">
                            <div className="group__bottom--allmedia">
                              <div className="media-wrapper">
                                <ul
                                  className="nav nav-tabs"
                                  id="myTab4"
                                  role="tablist"
                                >
                                  <li className="nav-item" role="presentation">
                                    <button
                                      className="nav-link active"
                                      id="all-media-tab"
                                      data-bs-toggle="tab"
                                      data-bs-target="#all-media"
                                      type="button"
                                      role="tab"
                                      aria-controls="all-media"
                                      aria-selected="true"
                                    >
                                      <i className="fa-solid fa-table-cells-large"></i>{" "}
                                      All <span>12</span>
                                    </button>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <button
                                      className="nav-link"
                                      id="photos-media-tab"
                                      data-bs-toggle="tab"
                                      data-bs-target="#photos-media"
                                      type="button"
                                      role="tab"
                                      aria-controls="photos-media"
                                      aria-selected="false"
                                    >
                                      <i className="fa-solid fa-image"></i>{" "}
                                      Photos <span>4</span>
                                    </button>
                                  </li>

                                  {/* <li className="nav-item" role="presentation">
                                    <button
                                      className="nav-link"
                                      id="video-tab"
                                      data-bs-toggle="tab"
                                      data-bs-target="#video"
                                      type="button"
                                      role="tab"
                                      aria-controls="video"
                                      aria-selected="false"
                                    >
                                      <i className="fa-solid fa-video"></i>{" "}
                                      Videos <span>4</span>
                                    </button>
                                  </li> */}
                                </ul>

                                <div className="tab-content" id="myTabContent3">
                                  <div
                                    className="tab-pane fade show active"
                                    id="all-media"
                                    role="tabpanel"
                                    aria-labelledby="all-media-tab"
                                  >
                                    <div className="media-content">
                                      <ul className="media-upload">
                                        <li className="upload-now">
                                          <div className="custom-upload">
                                            <div className="file-btn">
                                              <i className="fa-solid fa-upload"></i>{" "}
                                              Upload
                                            </div>
                                            <input type="file" />
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-3 g-3">
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/01.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/01.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb albam-thumb">
                                            <img
                                              src="/assets/images/allmedia/02.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/02.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-camera"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/03.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/03.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/04.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/04.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/05.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/05.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb albam-thumb">
                                            <img
                                              src="/assets/images/allmedia/06.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/06.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-camera"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/07.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/07.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/08.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/08.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/09.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/09.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb albam-thumb">
                                            <img
                                              src="/assets/images/allmedia/10.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/10.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-camera"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/11.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/11.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb albam-thumb">
                                            <img
                                              src="/assets/images/allmedia/12.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/12.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-camera"></i>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-center mt-5">
                                        <a href="#" className="default-btn">
                                          <i className="fa-solid fa-spinner"></i>{" "}
                                          Load More
                                        </a>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="tab-pane fade"
                                    id="photos-media"
                                    role="tabpanel"
                                    aria-labelledby="photos-media-tab"
                                  >
                                    <div className="media-content">
                                      <ul className="media-upload">
                                        <li className="upload-now">
                                          <div className="custom-upload">
                                            <div className="file-btn">
                                              <i className="fa-solid fa-upload"></i>{" "}
                                              Upload
                                            </div>
                                            <input type="file" />
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-3 g-3">
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/03.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/03.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/04.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/04.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/08.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/08.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb">
                                            <img
                                              src="/assets/images/allmedia/09.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/09.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-image"></i>
                                            </a>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-center mt-5">
                                        <a href="#" className="default-btn">
                                          <i className="fa-solid fa-spinner"></i>{" "}
                                          Load More
                                        </a>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="tab-pane fade"
                                    id="video"
                                    role="tabpanel"
                                    aria-labelledby="video-tab"
                                  >
                                    <div className="media-content">
                                      <ul className="media-upload">
                                        <li className="upload-now">
                                          <div className="custom-upload">
                                            <div className="file-btn">
                                              <i className="fa-solid fa-upload"></i>{" "}
                                              Upload
                                            </div>
                                            <input type="file" />
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-3 g-3">
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/01.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/01.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/05.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/05.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/07.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/07.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="media-thumb video-thumb">
                                            <img
                                              src="/assets/images/allmedia/11.jpg"
                                              alt="dating thumb"
                                            />
                                            <a
                                              href="/assets/images/allmedia/11.jpg"
                                              target="_blank"
                                              className="icon"
                                            >
                                              <i className="fa-solid fa-circle-play"></i>
                                            </a>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-center mt-5">
                                        <a href="#" className="default-btn">
                                          <i className="fa-solid fa-spinner"></i>{" "}
                                          Load More
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 order-xl-0">
                    <div className="group__bottom--center">
                      <div className="story__item style2">
                        <div className="story__inner">
                          <div className="story__thumb position-relative">
                            <img
                              src={
                                USER_PROFILE?.avatars
                                  ? `${BASE_URL}/assets/images/${USER_PROFILE?.mainAvatar}`
                                  : userMale
                              }
                              alt="matrimonial thumb"
                            />
                          </div>
                          <div className="story__content px-0 pb-0">
                            <h4>{USER_PROFILE?.name || ""}</h4>
                            <div className="story__content--content mb-2 pb-3">
                              <p>
                                <i className="fa-solid fa-clock"></i> {activety}
                              </p>
                            </div>
                            <h4>Interests</h4>

                            <div className="">
                              <div className="">
                                {USER_PROFILE?.interest[0] ? (
                                  <div className="">
                                    <div className="row">
                                      {USER_PROFILE?.interest &&
                                        USER_PROFILE?.interest.map(
                                          (item, i) => (
                                            <div
                                              key={i}
                                              style={{
                                                margin: "10px auto",
                                                background: "#f24570",
                                                color: "#fff",
                                                padding: "5px 12px",
                                                borderRadius: "25px",
                                              }}
                                              className={`interest-item col-auto text-center  flex-nowrap `}
                                            >
                                              {item?.name}
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                ) : (
                                  <p>No interests available</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 order-xl-2">
                    <div className="group__bottom--right">
                      <ActiveMember />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      <FooterFour />
      <RelationshipMilestoneTracker
       showModal={mildStone} 
       hideModal={() => setMildStone(false)} 
       />
    </Fragment>
  );
};

export default UserProfile;
