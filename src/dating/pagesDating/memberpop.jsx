import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserData } from "../../assets/DummyData/userData";
import EventNotificationSchedule from "../component/popUps/eventNotificationSchedule ";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersByGender, fetchFriends } from "../../service/common-service/getuserbyGender";
import toast from "react-hot-toast";
import { BASE_URL } from "../../base";

const Memberpop = ({ showModal, hideModal, calenderScheduleDAte, userInfoDate, setSelectedData, setSelectedUser  }) => {

const [user, setuser] = useState([])
const [friends, setFriends] = useState([])
const [showFriends, setShowFriends] = useState(false)

  // const [favoriteContentList] = useState(UserData.slice(0, 18));
  const dispatch = useDispatch();
const UserData = JSON.parse(localStorage.getItem("userData"));




const { users, loading, error, friends: friendsData, friendsLoading, friendsError } = useSelector((state) => state.datingApi);


  useEffect(() => {
    const Mydata = async () => {
      try {
        const res = await dispatch(fetchUsersByGender({
          gender: UserData.data.looking,
          userId: UserData.data.mode
        })).unwrap();
        setuser(res.data)
      } catch (error) {
        toast.error("Failed to fetch users: " + error.message);
      }
    }
    Mydata()
  }, [])

  // Fetch friends when modal opens
  useEffect(() => {
    if (showModal) {
      const fetchFriendsData = async () => {
        try {
          const res = await dispatch(fetchFriends(UserData.data._id)).unwrap();
          if (res.isSuccess) {
            setFriends(res.data);
            setShowFriends(true);
          } else {
            toast.error("Failed to fetch friends: " + res.message);
          }
        } catch (error) {
          toast.error("Failed to fetch friends: " + error.message);
        }
      }
      fetchFriendsData();
    }
  }, [showModal, dispatch, UserData.data._id])
 

  return (
    <Modal size="xl" show={showModal} onHide={hideModal} centered>
      <span
        onClick={hideModal}
        style={{
          position: "absolute",
          right: "20px",
          top: "8px",
          color: "#213366",
          cursor: "pointer",
          zIndex: 9999,
          padding: "5px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <i className="fa fa-times fs-3 modal-cls" aria-hidden="true"></i>
      </span>
      <div className="section__wrapper mb-5">
        <div className="row">
          <div className="col p-3 mx-2">
            <div className="d-flex justify-content-between align-items-center">
              <h4>
                {showFriends ? "Here's Your Friends, Schedule Your Event's" : "Here's Your Matches, Schedule Your Event's"}
              </h4>
              {/* <div className="btn-group" role="group">
                <button 
                  type="button" 
                  className={`btn ${!showFriends ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setShowFriends(false)}
                >
                  Matches
                </button>
                <button 
                  type="button" 
                  className={`btn ${showFriends ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setShowFriends(true)}
                >
                  Friends
                </button>
              </div> */}

<div className="btn-group" role="group">
  <button
    type="button"
    className="btn"
    onClick={() => setShowFriends(false)}
    style={{
      backgroundColor: !showFriends ? '#f24570' : 'white',
      color: !showFriends ? 'white' : '#f24570',
      border: '2px solid #f24570',
      transition: 'all 0.3s',
    }}
    onMouseEnter={e => {
      if (!showFriends) e.target.style.backgroundColor = '#f24570';
      if (!showFriends) e.target.style.color = 'white';
      if (showFriends) e.target.style.backgroundColor = '#f24570';
      if (showFriends) e.target.style.color = 'white';
    }}
    onMouseLeave={e => {
      if (!showFriends) {
        e.target.style.backgroundColor = 'white';
        e.target.style.color = '#f24570';
      }
      if (showFriends) {
        e.target.style.backgroundColor = '#f24570';
        e.target.style.color = 'white';
      }
    }}
  >
    Matches
  </button>

  <button
    type="button"
    className="btn"
    onClick={() => setShowFriends(true)}
    style={{
      backgroundColor: showFriends ? '#f24570' : 'white',
      color: showFriends ? 'white' : '#f24570',
      border: '2px solid #f24570',
      transition: 'all 0.3s',
    }}
    onMouseEnter={e => {
      e.target.style.backgroundColor = '#f24570';
      e.target.style.color = 'white';
    }}
    onMouseLeave={e => {
      e.target.style.backgroundColor = showFriends ? '#f24570' : 'white';
      e.target.style.color = showFriends ? 'white' : '#f24570';
    }}
  >
    Friends
  </button>
</div>

            </div>
          </div>
        </div>

        <div className="row g-0 justify-content-center mx-12-none h-100">
          {showFriends ? (
            // Show friends
            friendsLoading ? (
              <div className="col-12 text-center">
                <p>Loading friends...</p>
              </div>
            ) : friends.length > 0 ? (
              friends.map((friend, i) => (
                <div className="member__item" key={i}>
                  <div className="member__inner member__inner-sized-hover react-main" onClick={() => {
                    // Convert friend data to match user format
                    const friendAsUser = {
                      _id: friend.friendId,
                      name: friend.friendName,
                      mainAvatar: friend.friendAvatar,
                      occupation: "Friend",
                      age: "",
                      address: "",
                      className: ""
                    };
                    setSelectedData(friendAsUser);
                    setSelectedUser(friendAsUser);
                    calenderScheduleDAte();
                  }}>
                    <div className="react">
                      {/* Add your logic here */}
                    </div>
                    <div className="member__thumbmember_thumb">
                      <img 
                        className="image23" 
                        src={`${BASE_URL}/assets/images/${friend.friendAvatar || "/default-avatar.png"}`} 
                        alt={friend.friendName || "friend"} 
                      />
                      <span className=""></span>
                    </div>
                    <div className="member__content">
                      <Link>
                        <h5>{friend.friendName}</h5>
                      </Link>
                      <p>
                        <span>Friend</span> <br /> || <span>Since {new Date(friend.friendshipDate).toLocaleDateString()}</span>
                      </p>
                      <p>Friend since {new Date(friend.friendshipDate).toLocaleDateString()}</p>
                    </div>

                    <div className="row mt-2 match-icon-main">
                      <div className="col">
                        <Link className="fs-3 ms-4" to={`/metrimonial/user-profile/${friend.friendId}`}>
                          <i className="fa fa-user" aria-hidden="true" title="Profile"></i>
                        </Link>
                      </div>

                      <div className="col">
                        <Link className="fs-3 ms-3" to="/dating/chat-page2">
                          <i className="fa fa-comment" aria-hidden="true" title="Message"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No friends found. Add some friends to schedule events with them!</p>
              </div>
            )
          ) : (
            // Show regular users/matches
            user.map((val, i) => (
            <div className="member__item" key={i}>
                <div className="member__inner member__inner-sized-hover react-main" onClick={() => {
                  setSelectedData(val);
                  setSelectedUser(val);
                  calenderScheduleDAte();
                }}>
                <div className="react">
                  {/* Add your logic here */}
                  {/* <img width="25" alt="" /> */}
                </div>
                <div className="member__thumbmember_thumb">
                    <img className="image23" src={`${BASE_URL}/assets/images/${val.mainAvatar || "/default-avatar.png"}`} alt={val.imgAlt || "user"} />
                  <span className={val.className}></span>
                </div>
                <div className="member__content">
                  {/* <Link to={`/dating/user-profile?userID=${val.id}`}>
                  </Link> */}
                    <Link>
                      <h5>{val.name}</h5>
                  </Link>
                  <p>
                    <span>{val.occupation}</span> <br /> || <span>{val.age}</span>
                  </p>
                  <p>{val.address}</p>
                </div>

                <div className="row mt-2 match-icon-main">
                  <div className="col">
                    <Link className="fs-3 ms-4" to={`/metrimonial/user-profile/${val?._id}`}>
                      <i className="fa fa-user" aria-hidden="true" title="Profile"></i>
                    </Link>
                  </div>

                  <div className="col">
                    <Link className="fs-3 ms-3" to="/dating/chat-page2">
                      <i className="fa fa-comment" aria-hidden="true" title="Message"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Memberpop;

