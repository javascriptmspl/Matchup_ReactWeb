import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterFour from "../component/layout/footerFour";
import Pagination from "../component/section/pagination";
import SelectProduct from "../component/select/selectproduct";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import loveRed from "../assets/images/icons/love_red.png";
import loveBlack from "../assets/images/icons/love_black.png";
import HeaderFour from "../component/layout/HeaderFour";
import { useDispatch, useSelector } from "react-redux";
import Lodder from "../component/layout/Lodder";
import { metriGetAllUsersAsync } from "../../service/MANAGE_SLICE/find-user-SLICE";
import { BASE_URL } from "../../base";
import {
  deleteActivitySlice,
  getAllActivies,
  getBySenderUserIds,
} from "../../dating/store/slice/ActivitiesSlice";
import { MODE_METRI } from "../../utils";
import userMale from "../../dating/assets/images/myCollection/user-male.jpg";
// import Astro from "../assets/images/astrology-horoscope.svg"
import astro from "../assets/images/icons/Astro.png";

const MatchPage = () => {
  const location = useLocation();
  const { likedUserId, likedUserName } = location.state || {};
  const { superLikedUserId, superLikedUserName } = location.state || {};
  const UserData = useSelector((state) => state.getAllUser.users);
  const loading = useSelector((state) => state.getAllUser.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAstroClick = () => navigate("/metrimonial/astro");

  const Store = useSelector((state) => state);
  let matchUserList = useSelector(
    (state) => Store?.activies?.Activity?.data || []
  );
  const Likes = matchUserList
    ? matchUserList.filter((i) => i.activityType === "like")
    : [];
  const SuperLikes = matchUserList
    ? matchUserList.filter((i) => i.activityType === "superlike")
    : [];
  const datingId = localStorage.getItem("userData");

  const user_Data = JSON.parse(datingId);
  const [favoriteContentList, setFavoriteContentList] = useState([]);
  const [favrorite, setFavorite] = useState(UserData);
  const [members, setMembers] = useState([]);
  const [matches, setMatches] = useState(UserData);

  useEffect(() => {
    dispatch(
      getBySenderUserIds({ modeid: MODE_METRI, id: user_Data.data._id })
    );
  }, [user_Data.data._id]);

  useEffect(() => {
    if (!loading) {
      setMatches(UserData);
      setFavorite(UserData);
    }
  }, [loading, UserData]);

  const handleClick = async (_id, userName, user) => {
    let loadingToastId;
    try {
      loadingToastId = toast.loading("Updating...");
      await dispatch(deleteActivitySlice(_id));

      dispatch(
        getBySenderUserIds({ modeid: MODE_METRI, id: user_Data.data._id })
      );

      toast.success(
        `You've removed ${userName} from favorites and added to matches. 😢`
      );
      toast.dismiss(loadingToastId);
    } catch (error) {
      console.error("Error in handleClick:", error);
      toast.dismiss(loadingToastId);
    }
  };

  const getBlackImage = (userId) => {
    const isFavrites = favoriteContentList.some((val) => val.id === userId);
    return isFavrites ? loveBlack : loveRed;
  };

  return (
    <>
      <HeaderFour />
      {loading ? (
        <Lodder />
      ) : (
        <div>
          <div className="member member--style2 padding-top padding-bottom">
            <div className="container ">
              <div className="member__info mb-4">
                <div className="member__info--left">
                  <div
                    className="group__bottom--head"
                    style={{
                      padding: 0,
                    }}
                  >
                    <div className="left">
                      <form action="#">
                        <input
                          className="bg-white"
                          type="text"
                          name="search"
                          placeholder="search"
                        />
                        <button type="submit">
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="member__info--right">
                  <div className="member__info--customselect right w-100">
                    <div className="default-btn">
                      <span>Order By:</span>
                    </div>
                    <div className="banner__inputlist">
                      <SelectProduct select={"Nearest"} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="section__wrapper mb-5">
                <div className="row">
                  <div className="col">
                    <h2>Match list</h2>
                  </div>
                </div>

                <div className="row g-0 mx-12-none justify-content-center wow fadeInUp">
                  {Likes && Likes.length > 0 ? (
                    Likes.map((val, i) => (
                      <div className="member__item " key={i}>
                        <div className="member__inner member__inner-sized-hover react-main position-relative">
                          {/* <div
                            className="member-atsro"
                            onClick={handleAstroClick}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={astro}
                              alt=""
                              className="member-atsro-imgs"
                            />
                            <small className="text-light float-end pe-2 pt-1">
                              Astro
                            </small>
                          </div> */}
                          <div className="react main_user_img">
                            <img
                              src={getBlackImage(val?.receiverUserId?._id)}
                              width="25"
                              alt=""
                              onClick={() =>
                                handleClick(
                                  val?._id,
                                  val?.receiverUserId?.name,
                                  val
                                )
                              }
                            />
                          </div>
                          <div className="member__thumb member__thumb__matches">
                            <img
                              src={
                                val?.receiverUserId?.mainAvatar
                                  ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                                  : val?.receiverUserId?.avatars?.[0]
                                  ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                                  : userMale
                              }
                              alt="dating thumb"
                              style={{ height: "100%", width: "100%" }}
                            />
                            <span
                              className={val?.receiverUserId?.className}
                            ></span>
                          </div>
                          <div className="member-atsro"
                          onClick={handleAstroClick}
                          style={{ cursor: "pointer" }}>
                            <img
                              src={astro}
                              alt=""
                              className="member-atsro-imgs"
                            />
                            <small className="text-light float-end pe-2 pt-1">
                              Astro
                            </small>
                          </div>
                          <div className="member__content">
                            <Link
                              to={`/metrimonial/user-profile/${val?.receiverUserId?._id}`}
                            >
                              <h5>{val?.receiverUserId?.name}</h5>
                            </Link>
                            <p>
                              <span>{val?.receiverUserId?.occupation}</span> ||{" "}
                              <span>{val?.receiverUserId?.age}</span>
                            </p>
                            <p>
                              <i
                                class="fa fa-map-marker"
                                style={{ color: "#f24570" }}
                                aria-hidden="true"
                              ></i>{" "}
                              {val?.receiverUserId?.address
                                ? val?.receiverUserId?.address
                                : val?.receiverUserId?.location}
                            </p>
                            <p>{val?.receiverUserId?.activity}</p>
                          </div>
                          <div className="row mt-2 match-icon-main">
                            <div className="col ">
                              <Link
                                className="fs-3 ms-4"
                                to={`/metrimonial/user-profile/${val?.receiverUserId?._id}`}
                              >
                                <i
                                  class="fa fa-user"
                                  aria-hidden="true"
                                  title="Profile"
                                ></i>
                              </Link>
                            </div>

                            <div className="col">
                              <Link
                                className="fs-3 ms-3"
                                to="/metrimonial/chat"
                              >
                                <i
                                  class="fa fa-comment"
                                  aria-hidden="true"
                                  title="Message"
                                ></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col text-center">
                      <h5>
                        "Matches are not available{" "}
                        <a href="/metrimonial/members">
                          <strong>
                            <u>Find Your Matche </u>
                          </strong>
                        </a>{" "}
                        now!"
                      </h5>
                    </div>
                  )}
                </div>
              </div>
              <div className="section__wrapper my-5">
                <div className="row">
                  <div className="col">
                    <h2>Favorite list</h2>
                  </div>
                </div>
                <div className="row g-0 justify-content-center mx-12-none">
                  {SuperLikes && SuperLikes.length > 0 ? (
                    SuperLikes.map((val, i) => (
                      <div className="member__item" key={i}>
                        <div className="member__inner member__inner-sized-hover react-main">
                          <div className="react">
                            <img
                              src={getBlackImage(val?.receiverUserId?._id)}
                              width="25"
                              alt=""
                              onClick={() =>
                                handleClick(
                                  val?._id,
                                  val?.receiverUserId?.name,
                                  val
                                )
                              }
                            />
                          </div>
                          <div className="member__thumb  member__thumb__matches">
                            <img
                              src={
                                val?.receiverUserId?.mainAvatar
                                  ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                                  : val?.receiverUserId?.avatars?.[0]
                                  ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                                  : userMale
                              }
                              alt={`${val?.receiverUserId?.imgAlt || "user"}`}
                              style={{ height: "100%", width: "100%" }}
                            />
                            <span
                              className={val?.receiverUserId?.className}
                            ></span>
                          </div>
                          <div className="member__content">
                            <Link
                              to={`/metrimonial/user-profile/${val?.receiverUserId?._id}`}
                            >
                              <h5>{val?.receiverUserId?.name}</h5>
                            </Link>
                            <div>
                              <p>
                                <span>{val?.receiverUserId?.occupation}</span>{" "}
                                || <span>{val?.receiverUserId?.age}</span>
                              </p>
                              <div>
                                <p>
                                  <i
                                    class="fa fa-map-marker"
                                    style={{ color: "#f24570" }}
                                    aria-hidden="true"
                                  ></i>{" "}
                                  {val?.receiverUserId?.address}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-2 match-icon-main">
                            <div className="col ">
                              <Link
                                className="fs-3 ms-4"
                                to={`/metrimonial/user-profile/${val?.receiverUserId?._id}`}
                              >
                                <i
                                  class="fa fa-user"
                                  aria-hidden="true"
                                  title="Profile"
                                ></i>
                              </Link>
                            </div>

                            <div className="col">
                              <Link
                                className="fs-3 ms-3"
                                to="/metrimonial/chat"
                              >
                                <i
                                  class="fa fa-comment"
                                  aria-hidden="true"
                                  title="Meassage"
                                ></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col text-center">
                      <h5>
                        "Matches are not available{" "}
                        <a href="/metrimonial/members">
                          <strong>
                            <u>Find Your Matches </u>
                          </strong>
                        </a>{" "}
                        now!"
                      </h5>
                    </div>
                  )}
                </div>
                <div className="member__pagination mt-4">
                  {/* <div className="member__pagination--left">
                <p>Viewing 1 - 20 of 12,345 Members</p>
              </div> */}
                  <div className="member__pagination--right">
                    {/* <Pagination /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FooterFour />
        </div>
      )}
    </>
  );
};

export default MatchPage;
