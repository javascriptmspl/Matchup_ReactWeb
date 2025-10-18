import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserData } from "../../../../assets/DummyData/userData";
import { getBySenderUserIds } from "../../../../dating/store/slice/ActivitiesSlice";
import userMale from "../../../../dating/assets/images/myCollection/user-male.jpg";
import { useDispatch, useSelector } from "react-redux";
import { MODE_METRI } from "../../../../utils";
import { BASE_URL } from "../../../../base";
import { fetchFriends } from "../../../../service/common-service/getuserbyGender";
import toast from "react-hot-toast";
const Memberpop = ({
  showModal,
  hideModal,
  calenderScheduleDAte,
  setSelectedData,
}) => {
  const dispatch = useDispatch();
  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const Store = useSelector((state) => state);
  let matchUserList = useSelector(
    (state) => Store?.activies?.Activity?.data || []
  );
  
  // Friends state
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const { friends: friendsData, friendsLoading, friendsError } = useSelector((state) => state.datingApi);
  
  useEffect(() => {
    dispatch(
      getBySenderUserIds({ modeid: MODE_METRI, id: user_Data.data._id })
    );
  }, [user_Data.data._id]);

  // Fetch friends when modal opens
  useEffect(() => {
    if (showModal) {
      const fetchFriendsData = async () => {
        try {
          const res = await dispatch(fetchFriends(user_Data.data._id)).unwrap();
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
  }, [showModal, dispatch, user_Data.data._id]);

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
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="heading">
                {showFriends ? "Here's Your Friends, Schedule Your Event's" : "Here's Your Matches, Schedule Your Event's"}
              </h3>
             

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

        <div className="row g-0 justify-content-center mx-12-none">
          {showFriends ? (
            // Show friends
            friendsLoading ? (
              <div className="col-12 text-center">
                <p>Loading friends...</p>
              </div>
            ) : friends.length > 0 ? (
              friends.map((friend, i) => (
                <div className="member__item" key={i}>
                  <div
                    className="member__inner member__inner-sized-hover react-main"
                    onClick={() => {
                      // Convert friend data to match user format
                      const friendAsUser = {
                        _id: friend.friendId,
                        name: friend.friendName,
                        mainAvatar: friend.friendAvatar,
                        avatars: [friend.friendAvatar],
                        occupation: "Friend",
                        age: "",
                        address: "",
                        className: ""
                      };
                      setSelectedData(friendAsUser);
                      calenderScheduleDAte();
                    }}
                  >
                    <div className="react">
                      {/* Add your logic here */}
                    </div>
                    <div className="member__thumbmember_thumb">
                      <img
                        className="image23"
                        src={
                          friend.friendAvatar
                            ? `${BASE_URL}/assets/images/${friend.friendAvatar}`
                            : userMale
                        }
                        alt={friend.friendName || "friend"}
                      />
                      <span className=""></span>
                    </div>
                    <div className="member__content">
                      <Link>
                        <h5>{friend.friendName}</h5>
                      </Link>
                      <p>
                        <span>Friend</span> || <span>Since {new Date(friend.friendshipDate).toLocaleDateString()}</span>
                      </p>
                      <p>Friend since {new Date(friend.friendshipDate).toLocaleDateString()}</p>
                    </div>

                    <div className="row mt-2 match-icon-main">
                      <div className="col">
                        <Link
                          className="fs-3 ms-4"
                          to={`/metrimonial/user-profile/${friend.friendId}`}
                        >
                          <i
                            className="fa fa-user"
                            aria-hidden="true"
                            title="Profile"
                          ></i>
                        </Link>
                      </div>

                      <div className="col">
                        <Link className="fs-3 ms-3" to="/dating/chat-page2">
                          <i
                            className="fa fa-comment"
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
              <div className="col-12 text-center">
                <p>No friends found. Add some friends to schedule events with them!</p>
              </div>
            )
          ) : (
            // Show regular matches
            matchUserList.map((val, i) => (
              <div className="member__item" key={i}>
                <div
                  className="member__inner member__inner-sized-hover react-main"
                  onClick={() => {
                    setSelectedData(val.receiverUserId); // Only pass the user object!
                    calenderScheduleDAte();
                  }}
                >
                  <div className="react">
                    {/* Add your logic here */}
                    {/* <img width="25" alt="" /> */}
                  </div>
                  <div className="member__thumbmember_thumb">
                    <img
                      className="image23"
                      src={
                        val?.receiverUserId?.mainAvatar
                          ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                          : val?.receiverUserId?.avatars?.[0]
                          ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                          : userMale
                      }
                      alt={`${val?.receiverUserId?.imgAlt || "user"}`}
                    />
                    <span className={val?.receiverUserId?.className}></span>
                  </div>
                  <div className="member__content">
                    {/* <Link to={`/dating/user-profile?userID=${val.id}`}>
                    </Link> */}
                    <Link>
                      <h5>{val?.receiverUserId?.name}</h5>
                    </Link>
                    <p>
                      <span>{val?.receiverUserId?.occupation}</span> ||{" "}
                      <span>{val?.receiverUserId?.age}</span>
                    </p>
                    <p>{val?.receiverUserId?.address}</p>
                  </div>

                  <div className="row mt-2 match-icon-main">
                    <div className="col">
                      <Link
                        className="fs-3 ms-4"
                        to={`/metrimonial/user-profile/${val.receiverUserId?._id}`}
                      >
                        <i
                          className="fa fa-user"
                          aria-hidden="true"
                          title="Profile"
                        ></i>
                      </Link>
                    </div>

                    <div className="col">
                      <Link className="fs-3 ms-3" to="/dating/chat-page2">
                        <i
                          className="fa fa-comment"
                          aria-hidden="true"
                          title="Message"
                        ></i>
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
