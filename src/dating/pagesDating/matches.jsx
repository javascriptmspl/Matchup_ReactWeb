import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterFour from "../component/layout/footerFour";
import SelectProduct from "../component/select/selectproduct";
import toast from "react-hot-toast";

import loveRed from "../assets/images/icons/love_red.png";
import loveBlack from "../assets/images/icons/love_black.png";
import HeaderFour from "../../component/layout/HeaderFour";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "../../assets/DummyData/userData";
import { createActivity, fetchUsersByGender, getActivitiesBySenderUserId } from "../../service/common-service/getuserbyGender";
import { BASE_URL } from "../../base";
import { fetchChatRoomsAsync } from "../../service/MANAGE_SLICE/chatSlice";

const MatchPage = () => {
  const [favoriteContentList, setFavoriteContentList] = useState([]);
  const [loveImageStatus, setLoveImageStatus] = useState({});
  const [userData, setUserData] = useState(UserData);
  const [favrorite, setFavorite] = useState(UserData.slice(0, 7));
  const [matches, setMatches] = useState(UserData.slice(8, 15));
  const [user , setuser]=useState([])
  const [matchUserList, setMatchUserList] = useState([]);
  const User = JSON.parse(localStorage.getItem("userData"))
  const userId = User?.data?._id;
  const findUser = User?.data?.looking;
  const modeId = User?.data?.mode;
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const chatStatus = useSelector((state) => state.chat?.status)
  
  // Handle chat icon click
  const handleChatClick = async (toUserId) => {
    try {
      await dispatch(fetchChatRoomsAsync({ 
        userId: userId, 
        toUserId: toUserId 
      })).unwrap()
      navigate('/dating/chat-page2')
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error)
      toast.error('Failed to load chat rooms')
    }
  }

  const getLoveImage = (userId) => {
    const isMatches = favoriteContentList.some((val) => val.id === userId);
    return isMatches ? loveRed : loveBlack;
  };

  const getBlackImage = (userId) => {
    const isFavrites = favoriteContentList.some((val) => val.id === userId);
    return isFavrites ? loveBlack : loveRed;
  };

  useEffect(() => {
    const Mydata = async () => {
      try {
        const res = await dispatch(fetchUsersByGender({
          gender: findUser,
          userId: modeId
        })).unwrap();
        setuser(res.data)
      } catch (error) {
        toast.error("Failed to fetch users: " + error.message);
      }
    }
    Mydata()
  }, [])

  useEffect(() => {
    const Mydata = async () => {
      try {
        const res = await dispatch(getActivitiesBySenderUserId({
          senderUserId: userId,
          modeId: modeId,
          page_number: 1,
          page_size: 10
        })).unwrap();
        setMatchUserList(res?.data)
      } catch (error) {
        toast.error("Failed to fetch activities: " + error.message);
      }
    }
    Mydata()
  }, [])




  const buttonEvent = async (id, reaction) => {
    try {
  const res = await dispatch(
        createActivity({
          senderUserId: userId,
          receiverUserId: id,
          action_logs: `User ${userId} ${reaction} User ${id}`,
          description: `${reaction} Action`,
          note: "",
          mode: modeId,
          activityType: reaction,
          page_number: 1,  
          page_size: 10,
        })
      ).unwrap();
      if(res){
      const res2 = await dispatch(
          getActivitiesBySenderUserId({
            senderUserId: userId,
            modeId: modeId,
            page_number: 1,
            page_size: 10,
          })
        ).unwrap();
        setMatchUserList(res2?.data);
      }
      toast.success(`${reaction} action performed successfully`);
    } catch (err) {
      console.error("Activity error:", err);
      toast.error("Failed to perform action");
    }
  };
  
  const Likes = matchUserList
  ? matchUserList.filter((i) => i.activityType === "like")
  : [];
const SuperLikes = matchUserList
  ? matchUserList.filter((i) => i.activityType === "superlike")
  : [];
  
  

  return (
    <>
      <HeaderFour />

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
                <h2>Favorite list</h2>
              </div>
            </div>

            <div className="row g-0 justify-content-center mx-12-none">
                  {SuperLikes && SuperLikes.length > 0 ? (
                    SuperLikes.map((val, i) => (
                      <div className="member__item" key={i}>
                        <div className="member__inner member__inner-sized-hover react-main">
                          <div className="react">
                            <div className="command-swiper" onClick={() => buttonEvent(val?.receiverUserId?._id, "superlike")}>
                              <i className="fa-solid fa-star" style={{ color: '#387ADF' }}></i>
                            </div>
                          </div>
                          <div className="member__thumb  member__thumb__matches">
                            <img
                              src={
                                val?.receiverUserId?.mainAvatar
                                  ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                                  : val?.receiverUserId?.avatars?.[0]
                                  ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                                  : null
                              }
                              alt={`${val?.receiverUserId?.imgAlt || "user"}`}
                              style={{ width: "100%", height: "100%" }}
                            />
                            <span
                              className={val?.receiverUserId?.className}
                            ></span>
                          </div>
                          <div className="member__content">
                            <Link
                              to={`/dating/user-profile/${val?.receiverUserId?._id}`}
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
                                to={`/dating/user-profile/${val?.receiverUserId?._id}`}
                              >
                                <i
                                  class="fa fa-user"
                                  aria-hidden="true"
                                  title="Profile"
                                ></i>
                              </Link>
                            </div>
 
                           
                            
                      <div className="col">
                        <button 
                          className="fs-3 ms-3 border-0 bg-transparent" 
                          onClick={() => handleChatClick(val?.receiverUserId?._id)}
                          disabled={chatStatus === 'loading'}
                          style={{ color: chatStatus === 'loading' ? '#ccc' : 'inherit' }}
                        >
                          <i
                            className="fa fa-comment"
                            aria-hidden="true"
                            title="Message"
                          ></i>
                          {chatStatus === 'loading' && <span className="ms-1">...</span>}
                        </button>
                      </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col text-center">
                      <h5>
                        "Favorite List are not available{" "}
                        <a href="/dating/members">
                          <strong>
                            <u>Find Your Matches </u>
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
                <h2>Match list</h2>
              </div>
            </div>
            <div className="row g-0 justify-content-center mx-12-none">
              {Likes && Likes.length > 0 ? (
              Likes.slice(0,10).map((val, i) => (
                <div className="member__item" key={i}>
                  <div className="member__inner member__inner-sized-hover react-main">
                    <div className="react">
                      <img
                        src={getBlackImage(val?.receiverUserId?._id)}
                        width="25"
                        alt=""
                        onClick={() => buttonEvent(val?.receiverUserId?._id, "like")}
                      />
                    </div>
                    <div className="member__thumb">
                      <img style={{width:"100%",height:"100%"}}
                      src={
                        val?.receiverUserId?.mainAvatar
                          ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                          : val?.receiverUserId?.avatars?.[0]
                          ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                          : null
                      }
                      alt={`${val?.receiverUserId?.name}`}
                       
                       />
                      <span className={val.className}></span>
                    </div>
                    <div className="member__content">
                      <Link to={`/dating/user-profile/${val?.receiverUserId?._id}`}>
                        <h5>{val?.receiverUserId?.name}</h5>
                      </Link>
                      <div>
                        <p>
                          <span>{val?.receiverUserId?.education || "Not Found"}</span> ||{" "}
                          <span>{val?.receiverUserId?.age || "Not Found"}</span>
                        </p>
                        <div>
                          <p>
                            <i
                              class="fa fa-map-marker"
                              style={{ color: "#f24570" }}
                              aria-hidden="true"
                            ></i>{" "}
                            {val?.receiverUserId?.address || "Not Found"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2 match-icon-main">
                      <div className="col ">
                        <Link
                          className="fs-3 ms-4"
                          to={`/dating/user-profile/${val?.receiverUserId?._id}`}
                        >
                          <i
                            class="fa fa-user"
                            aria-hidden="true"
                            title="Profile"
                          ></i>
                        </Link>
                      </div>

                      <div className="col">
                        <button 
                          className="fs-3 ms-3 border-0 bg-transparent" 
                          onClick={() => handleChatClick(val?.receiverUserId?._id)}
                          disabled={chatStatus === 'loading'}
                          style={{ color: chatStatus === 'loading' ? '#ccc' : 'inherit' }}
                        >
                          <i
                            className="fa fa-comment"
                            aria-hidden="true"
                            title="Message"
                          ></i>
                          {chatStatus === 'loading' && <span className="ms-1">...</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ):(
                <div className="col text-center">
                  <h5>No matches found</h5>
                </div>
              )}
            </div>
        
          </div>
        </div>
      </div>
      <FooterFour />
    </>
  );
};

export default MatchPage;
