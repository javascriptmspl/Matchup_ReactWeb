import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../component/layout/pageheader";
import SelectProduct from "../component/select/selectproduct";
import ActiveGroup from "../component/sidebar/group";
import ActiveMember from "../component/sidebar/member";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import InstallApp from "../component/popUps/installApp";
import userMale from "../assets/images/myCollection/user-male.jpg";

import img1 from "../assets/images/member/profile/01.jpg";
import img2 from "../assets/images/member/profile/02.jpg";
import img3 from "../assets/images/member/profile/03.jpg";
import img4 from "../assets/images/member/profile/04.jpg";
import img5 from "../assets/images/member/profile/05.jpg";
import img6 from "../assets/images/member/profile/06.jpg";

import img11 from "../assets/images/member/profile/profile.jpg";
// male img
import imgmale1 from "../assets/images/member/male/02.jpg";
import imgmale2 from "../assets/images/member/male/03.jpg";
import imgmale3 from "../assets/images/member/male/04.jpg";
import imgmale4 from "../assets/images/member/male/05.jpg";

//female img
import imgfemale1 from "../assets/images/member/female/01.jpg";
import imgfemale2 from "../assets/images/member/female/02.jpg";
import imgfemale3 from "../assets/images/member/female/03.jpg";
import imgfemale4 from "../assets/images/member/female/04.jpg";
import imgfemale5 from "../assets/images/member/female/05.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfileAsync,
  uploadProfilePictureAsync,
} from "../store/slice/profileSlice";
import ActivityPage from "../pagesDating/activity";
import ShareProfile from "../../pages/ShareUserProfileModal";
import moment from "moment";
import ShowPhotoViewerModal from "../component/popUps/photoAlbum";
import { getByIdUsersAsync } from "../store/slice/AuthSlice";
import { USER_ID_LOGGEDIN } from "../../utils";
import { BASE_URL } from "../../base";
const activety = "Online";

let MideaAll = [
  {
    id: 1,
    imgUrl: imgmale1,
    imgAlt: "Dating Thumb",
  },
  {
    id: 2,
    imgUrl: imgmale2,
    imgAlt: "Dating Thumb",
  },
  {
    id: 3,
    imgUrl: imgmale4,
    imgAlt: "Dating Thumb",
  },
  {
    id: 4,
    imgUrl: imgfemale3,
    imgAlt: "Dating Thumb",
  },
  {
    id: 5,
    imgUrl: imgfemale5,
    imgAlt: "Dating Thumb",
  },
  {
    id: 6,
    imgUrl: imgmale2,
    imgAlt: "Dating Thumb",
  },
  {
    id: 7,
    imgUrl: imgfemale5,
    imgAlt: "Dating Thumb",
  },
  {
    id: 8,
    imgUrl: imgfemale5,
    imgAlt: "Dating Thumb",
  },
  {
    id: 9,
    imgUrl: imgfemale5,
    imgAlt: "Dating Thumb",
  },
];

const MyProfile = () => {
  const uploading = useSelector((state) => state.profile?.uploading);
  const profileData = useSelector((state) => state.profile?.userData);
  const data = useSelector((state) => state.userCreate);
  const [showInstallApp, setShowInstallApp] = useState(false);
  const [force, forceUpdate] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showPhoto, setShowPhoto] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const userId = USER_ID_LOGGEDIN;
  const UserData = data?.user[0];

  const getUser = JSON.parse(localStorage.getItem("userData"));
  const id = getUser?.data?._id;

  const handleImageClickOpenModal = (image) => {
    setSelectedImage(image);
    setShowPhoto(true);
  };

  const [valuenew, setValueNew] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfileAsync(userId));
    dispatch(getByIdUsersAsync(id));
  }, [force, dispatch, userId]);

  const User = profileData?.[0] ?? UserData;

  const lastimg = User?.avatars.length - 1;

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(uploadProfilePictureAsync({ imageData: file, userId })).then(
        () => {
          forceUpdate(!force);
        }
      );
    }
  };

  const interests = [
    "Traveling",
    "Reading",
    "Cooking",
    "Sports",
    "Music",
    "Photography",
  ];

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

                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link "
                      id="gt3-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#gt3"
                      type="button"
                      role="tab"
                      aria-controls="gt3"
                      aria-selected="false"
                    >
                      <i className="fa-solid fa-photo-film"></i> Media{" "}
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link "
                      id="gt4-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#gt4"
                      type="button"
                      role="tab"
                      aria-controls="gt4"
                      aria-selected="false"
                    >
                      <i class="fa fa-sticky-note" aria-hidden="true"></i>{" "}
                      Activity{" "}
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link "
                      id="gt5-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#gt5"
                      type="button"
                      role="tab"
                      aria-controls="gt5"
                      aria-selected="false"
                    >
                      <i class="fa-solid fa-share-nodes"></i> Share profile{" "}
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
                      className="tab-pane fade show active "
                      id="gt1"
                      role="tabpanel"
                      aria-labelledby="gt1-tab"
                    >
                      <div className="info">
                        <div className="info-card mb-4">
                          <div className="info-card-title">
                            <h6>
                              Bio{" "}
                              <span>
                                <Link
                                  to="/dating/aboutinfo/"
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
                            <p>{User?.description || ""}</p>
                          </div>
                        </div>

                        <div className="info-card mb-4">
                          <div className="info-card-title">
                            <h6>
                              Basic Info{" "}
                              <span>
                                <Link
                                  to="/dating/manage-profile"
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
                                <p className="info-name">Name</p>
                                <p className="info-details">
                                  {User?.name || ""}
                                </p>
                              </li>
                              <li>
                                <p className="info-name">I'm a</p>
                                <p className="info-details">
                                  {User?.iAm === "Male" ? "Man" : "Woman" || ""}
                                </p>
                              </li>
                              <li>
                                <p className="info-name">Loking for a</p>
                                <p className="info-details">
                                  {User?.looking === "Female" ? "Woman" : "Man"}
                                </p>
                              </li>
                              <li>
                                <p className="info-name">Marital Status</p>
                                <p className="info-details">
                                  {User?.marital || ""}
                                </p>
                              </li>

                              <li>
                                <p className="info-name">Date of Birth</p>
                                <p className="info-details">
                                  {moment(User?.dob).format("DD/MM/YYYY")}
                                  {/* {User?.dob
                                    ? new Date(User.dob).toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "numeric",
                                          day: "numeric",
                                          
                                        }
                                      )
                                    : ""} */}
                                </p>
                              </li>
                              <li>
                                <p className="info-name">Height</p>
                                <p className="info-details">
                                  {`${User?.Height} ft` || ""}
                                </p>
                              </li>
                              <li>
                                <p className="info-name">Address</p>
                                <p className="info-details">
                                  {User?.address || ""}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-card-title">
                            <h6>
                              Contact Details{" "}
                              <span>
                                <Link
                                  to="/dating/contactdetail"
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
                              </span>
                            </h6>
                          </div>
                          <div className="info-card-content">
                            <ul className="info-list">
                              <li>
                                <p className="info-name">Email</p>
                                <p className="info-details">
                                  {User?.email || ""}
                                </p>
                              </li>

                              <li>
                                <p className="info-name">Phone</p>
                                <p className="info-details">
                                  {User?.phoneNumber || ""}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade show "
                      id="gt3"
                      role="tabpanel"
                      aria-labelledby="gt3-tab"
                    >
                      <div className="group__bottom--body bg-white">
                        <div className="group__bottom--allmedia">
                          <div className="media-wrapper">
                            <ul
                              className="nav nav-tabs"
                              id="myTab3"
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
                                  id="album-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#album"
                                  type="button"
                                  role="tab"
                                  aria-controls="album"
                                  aria-selected="false"
                                >
                                  <i className="fa-solid fa-camera"></i> Albums{" "}
                                  <span>4</span>
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
                                  <i className="fa-solid fa-image"></i> Photos{" "}
                                  <span>4</span>
                                </button>
                              </li>
                            </ul>

                            <div className="tab-content" id="myTabContent3">
                              {/* midea all images show on modal  */}
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
                                    <ShowPhotoViewerModal
                                      showModal={showPhoto}
                                      hideModal={() => setShowPhoto(false)}
                                      selectedImage={selectedImage}
                                    />
                                    {MideaAll.map((item) => (
                                      <div
                                        className="col"
                                        key={item.id}
                                        onClick={() =>
                                          handleImageClickOpenModal(item)
                                        }
                                      >
                                        <div className="media-thumb video-thumb pointer">
                                          <img
                                            src={item.imgUrl}
                                            alt={item.imgAlt}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="text-center mt-5">
                                    <a href="#" className="default-btn">
                                      <i className="fa-solid fa-spinner"></i>{" "}
                                      Load More
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* midea album images show on modal */}
                              <div
                                className="tab-pane fade"
                                id="album"
                                role="tabpanel"
                                aria-labelledby="album-tab"
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
                                      <div className="media-thumb albam-thumb">
                                        <img
                                          src="../assets/images/allmedia/02.jpg"
                                          alt="dating thumb"
                                        />
                                        <a
                                          href="../assets/images/allmedia/02.jpg"
                                          target="_blank"
                                          className="icon"
                                        >
                                          <i className="fa-solid fa-camera"></i>
                                        </a>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <div className="media-thumb albam-thumb">
                                        <img
                                          src="../assets/images/allmedia/06.jpg"
                                          alt="dating thumb"
                                        />
                                        <a
                                          href="../assets/images/allmedia/06.jpg"
                                          target="_blank"
                                          className="icon"
                                        >
                                          <i className="fa-solid fa-camera"></i>
                                        </a>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <div className="media-thumb albam-thumb">
                                        <img
                                          src="../assets/images/allmedia/10.jpg"
                                          alt="dating thumb"
                                        />
                                        <a
                                          href="../assets/images/allmedia/10.jpg"
                                          target="_blank"
                                          className="icon"
                                        >
                                          <i className="fa-solid fa-camera"></i>
                                        </a>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <div className="media-thumb albam-thumb">
                                        <img
                                          src="../assets/images/allmedia/12.jpg"
                                          alt="dating thumb"
                                        />
                                        <a
                                          href="../assets/images/allmedia/12.jpg"
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

                              {/* midea photos images show on modal */}
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
                                    {MideaAll.map((item) => (
                                      <div
                                        className="col"
                                        key={item.id}
                                        onClick={() =>
                                          handleImageClickOpenModal(item)
                                        }
                                      >
                                        <div className="media-thumb video-thumb pointer">
                                          <img
                                            src={item.imgUrl}
                                            alt={item.imgAlt}
                                          />
                                        </div>
                                      </div>
                                    ))}
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

                    <div
                      className="tab-pane fade show "
                      id="gt4"
                      role="tabpanel"
                      aria-labelledby="gt4-tab"
                    >
                      <ActivityPage />
                    </div>
                    <div
                      className="tab-pane fade show "
                      id="gt5"
                      role="tabpanel"
                      aria-labelledby="gt5-tab"
                    >
                      <ShareProfile />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 order-xl-0">
                <div className="group__bottom--center">
                  <div className="story__item style2">
                    <div className="story__inner">
                      <div className="story__thumb position-relative">
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                          id="imageInput"
                        />
                        <label
                          htmlFor="imageInput"
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={
                              User?.mainAvatar
                                ? `${BASE_URL}/assets/images/${User?.mainAvatar}`
                                : User?.avatars?.[0]
                                ? `${BASE_URL}/assets/images/${User?.avatars?.[0]}`
                                : userMale
                            }
                            style={{
                              objectFit: "cover",
                              height: "279px",
                            }}
                            alt="dating thumb"
                          />

                          {uploading && <p>Uploading...</p>}
                        </label>
                      </div>
                      <div className="story__content">
                        <h4>{User?.name}</h4>
                        <div className="story__content--content mb-2 pb-3">
                          <p>
                            <i
                              className="fa-sharp fa-solid fa-circle"
                              size="2xs"
                              style={{ color: "#11e415" }}
                            />{" "}
                            {activety}
                            {/* <i className="fa-solid fa-clock"></i> */}
                            {/* <i class=" fa-solid fa-location-dot fa-2xl" style={{margin:"10px",float:"right",fontSize:"x-large",cursor:"pointer"}}/> */}
                          </p>
                        </div>
                        <div className="story__content--author pb-2"></div>
                      </div>
                      <div className="">
                        <h4>Interests</h4>
                        <div className="row">
                          {interests.map((interest, index) => (
                            <div
                              key={index}
                              style={{
                                margin: "3px 5px",
                                background: "#f24570",
                                color: "#fff",
                                padding: "5px 12px",
                                borderRadius: "25px",
                                cursor: "pointer",
                              }}
                              className={`interest-item col-auto text-center  interest-item-profile flex-nowrap ${
                                selectedInterests.includes(interest)
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              {interest}
                            </div>
                          ))}
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
    </Fragment>
  );
};

export default MyProfile;
