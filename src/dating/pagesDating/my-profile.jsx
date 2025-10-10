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

import ActivityPage from "../pagesDating/activity";
import ShareProfile from "../../pages/ShareUserProfileModal";
import moment from "moment";
import ShowPhotoViewerModal from "../component/popUps/photoAlbum";
import { getByIdUsersAsync } from "../store/slice/AuthSlice";
import { USER_ID_LOGGEDIN } from "../../utils";
import { BASE_URL } from "../../base";
import { uploadMediaAsync } from "../../service/common-service/upload-images";
import { getUserProfileAsync, uploadProfilePictureAsync } from "../store/slice/profileSlice";
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
  const [visibleCountAll, setVisibleCountAll] = useState(9);
  const [visibleCountAlbum, setVisibleCountAlbum] = useState(9);
  const [visibleCountPhoto, setVisibleCountPhoto] = useState(9);

  const userId = USER_ID_LOGGEDIN;
  const UserData = data?.user[0];

  const [mediaList, setMediaList] = useState([]);
  const [pendingUploads, setPendingUploads] = useState([]);
  const getUser = JSON.parse(localStorage.getItem("userData"));
  const id = getUser?.data?._id;
  const userID = USER_ID_LOGGEDIN;

  const handleImageClickOpenModal = (image) => {
    setSelectedImage(image);
    setShowPhoto(true);
  };

  const handleUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPending = files.map((file, idx) => ({
        id: Date.now() + idx,
        imgUrl: URL.createObjectURL(file),
        imgAlt: "uploaded",
        type: type || "all",
        temp: true,
        name: file.name,
      }));
      setPendingUploads((prev) => [...newPending, ...prev]);
      dispatch(uploadMediaAsync({ userId, files, type })).then(() => {
        dispatch(getUserProfileAsync(userID)).then(() => {
          forceUpdate((f) => !f);
        });
      });
    }
  };

  const [valuenew, setValueNew] = useState("");
  const dispatch = useDispatch();
  const User = profileData ?? UserData;

  // Build media list from user's avatars so thumbnails render
  useEffect(() => {
    if (User && Array.isArray(User.avatars)) {
      setMediaList(
        User.avatars.map((img, idx) => ({
          id: idx,
          imgUrl: `${BASE_URL}/assets/images/${img}`,
          imgAlt: "uploaded",
          type: "all",
          name: typeof img === "string" ? img.split("/").pop() : undefined,
        }))
      );
    } else {
      setMediaList([]);
    }
  }, [User]);

  useEffect(() => {
    dispatch(getUserProfileAsync(userId));
    dispatch(getByIdUsersAsync(id));
  }, [force, dispatch, userId]);

  const lastimg = (User?.avatars?.length ?? 0) - 1;

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
                            <p>
                              {User?.description || "Please add Bio"}
                            </p>
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
                                  {`${User?.Height} ft` || "Please Add Height"}
                                </p>
                              </li>
                              <li>
                                <p className="info-name">Address</p>
                                <p className="info-details">
                                  {User?.address || "Please add address"}
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
                                  {User?.phoneNumber ||
                                    "Please Add Phone Number"}
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
                                      All{" "}
                                      <span>
                                        {" "}
                                        {
                                          [...pendingUploads, ...mediaList]
                                            .length
                                        }{" "}
                                      </span>
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
                                      <i className="fa-solid fa-camera"></i>{" "}
                                      Albums{" "}
                                      <span>
                                        {" "}
                                        {
                                          [...pendingUploads, ...mediaList]
                                            .filter(item => item.type === 'album')
                                            .length
                                        }
                                      </span>
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
                                      Photos{" "}
                                      <span>
                                        {" "}
                                        {
                                          [...pendingUploads, ...mediaList]
                                            .filter(item => item.type === 'photo')
                                            .length
                                        }
                                      </span>
                                    </button>
                                  </li>
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
                                            <input
                                              type="file"
                                              onChange={(e) => handleUpload(e, "all")}
                                            />
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-3 g-3">
                                        <ShowPhotoViewerModal
                                          showModal={showPhoto}
                                          hideModal={() => setShowPhoto(false)}
                                          selectedImage={selectedImage}
                                        />

                                        {[...mediaList]
                                          .slice(0, visibleCountAll)
                                          .map((item) => (
                                            <div className="col" key={item.id}>
                                              <div className="media-thumb video-thumb pointer">
                                                <img
                                                  src={item.imgUrl}
                                                  alt={
                                                    item.imgAlt || "uploaded"
                                                  }
                                                />
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                      <div className="text-center mt-5">
                                        {[...pendingUploads, ...mediaList]
                                          .length > visibleCountAll && (
                                          <button
                                            className="default-btn"
                                            onClick={() =>
                                              setVisibleCountAll(
                                                [
                                                  ...pendingUploads,
                                                  ...mediaList,
                                                ].length
                                              )
                                            }
                                          >
                                            <i className="fa-solid fa-spinner"></i>{" "}
                                            Load More
                                          </button>
                                        )}
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
                                            <input
                                              type="file"
                                              onChange={(e) => handleUpload(e, "album")}
                                            />
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-3 g-3">
                                        {[...pendingUploads, ...mediaList]
                                          .filter(item => item.type === 'album')
                                          .slice(0, visibleCountAlbum)
                                          .map((item) => (
                                            <div className="col" key={item.id}>
                                              <div className="media-thumb albam-thumb">
                                                <img
                                                  src={item.imgUrl}
                                                  alt={
                                                    item.imgAlt || "uploaded"
                                                  }
                                                />
                                              </div>
                                            </div>
                                          ))}
                                      </div>

                                      <div className="text-center mt-5">
                                        <button
                                          className="default-btn"
                                          onClick={() =>
                                            setVisibleCountAlbum(
                                              [...pendingUploads, ...mediaList]
                                                .filter(item => item.type === 'album')
                                                .length
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-spinner"></i>{" "}
                                          Load More
                                        </button>
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
                                            <input
                                              type="file"
                                              onChange={(e) =>
                                                handleUpload(e, "photo")
                                              }
                                            />
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-3 g-3">
                                        {[...pendingUploads, ...mediaList]
                                          .filter(item => item.type === 'photo')
                                          .slice(0, visibleCountPhoto)
                                          .map((item) => (
                                            <div className="col" key={item.id}>
                                              <div className="media-thumb video-thumb pointer">
                                                <img
                                                  src={item.imgUrl}
                                                  alt={
                                                    item.imgAlt || "uploaded"
                                                  }
                                                />
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                      <div className="text-center mt-5">
                                        <button
                                          className="default-btn"
                                          onClick={() =>
                                            setVisibleCountPhoto(
                                              [...pendingUploads, ...mediaList]
                                                .filter(item => item.type === 'photo')
                                                .length
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-spinner"></i>{" "}
                                          Load More
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* // share profile */}
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
                       
                          </p>
                        </div>
                        <div className="story__content--author pb-2"></div>
                      </div>
                      <div className="">
                        <h4>Interests</h4>
                        <div className="row">
                          {User?.interest?.map((interest, index) => (
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
                              {interest.name}
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
