import React, { useState, Fragment, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CalenderScheduleModal from "../component/popUps/calenderSchedule";
import userMale from "../assets/images/myCollection/user-male.jpg";
import toast from "react-hot-toast";
import MyContext from "../store/context/UseContext";
import { BASE_URL } from "../../base";

let GroupPageContentList = [
  // {
  //   imgUrl: "/assets/images/group/01.jpg",
  //   imgAlt: "Dating Thumb",
  //   title: "Harper Mitchell",
  //   desc: "Your meeting is scheduled with Harper Mitchell",
  //   activety: "2 days ago",
  //   date: "20th Jan",
  //   group: "Public Group",
  //   location: "Massachusetts",
  // },
  {
    imgUrl: "/assets/images/group/02.jpg",
    imgAlt: "Dating Thumb",
    title: "Evelyn Brown",
    desc: "Your meeting is scheduled with Evelyn Brown",
    activety: "2 days ago",
    group: "Public Group",
    date: "27th Jan",
    time:"3:30 PM",
    location: "New York",
    profession: "UX Designer",
    address: "Brooklyn Bridge, New York, NY 10038",
  },
  // {
  //   imgUrl: "/assets/images/group/03.jpg",
  //   imgAlt: "Dating Thumb",
  //   title: "Amelia Taylor",
  //   desc: "Your meeting is scheduled with Amelia Taylor",
  //   activety: "2 days ago",
  //   group: "Public Group",
  //   date: "30th Jan",
  //   location: "Chicago",
  // },
  // {
  //   imgUrl: "/assets/images/group/04.jpg",
  //   imgAlt: "Dating Thumb",
  //   title: "Manuela Moench",
  //   desc: "Your meeting is scheduled with Manuela Moench",
  //   activety: "2 days ago",
  //   group: "Public Group",
  //   date: "10th Feb",
  //   location: "Florida",
  // },
];



const EditEventViewSchedule = ({
  showModal,
  hideModal,
  calenderScheduleDAte,
  ViewUser,
  selectedUser,
  scheduledData,
  selectData,
}) => {
  const [storeData, setStoreData] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("dataEvent");
    console.log(JSON.parse(data));
    setStoreData(data ? [JSON.parse(data)] : []);
  }, []);

   useEffect(() => {
    const dataEvent = localStorage.getItem("dataEvent");
    const datanotifyEvent = localStorage.getItem("datanotifyEvent");
  
    const parsedDataEvent = dataEvent ? JSON.parse(dataEvent) : null;
    const parsedDatanotifyEvent = datanotifyEvent ? JSON.parse(datanotifyEvent) : null;
  
    console.log(parsedDataEvent, parsedDatanotifyEvent);
  
    // Assuming setStoreData is a function that updates the state
    setStoreData(parsedDataEvent && parsedDatanotifyEvent ? [parsedDataEvent, parsedDatanotifyEvent] : []);
  }, []);

  const profileData = useSelector((state) => state.profile.userData);

  const {eventArray}=useContext(MyContext)



  const User = profileData;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      toast.success("schedule date successfully updated");
      //  setButtonClass("default-btn reverse");
      hideModal(hideModal);
      console.log("checking  ato");
    } catch (error) {
      console.error("Error updating Contact profile:", error);
      toast.error("Failed to update Contact info");
    }
  };

  console.log("<<<<<<<<<<<<<ViewUser",ViewUser);

  return (
    <Modal show={showModal} onHide={hideModal} centered>
      <div className="main" style={{ position: "relative" }}>
        <span
          onClick={hideModal}
          style={{
            position: "absolute",
            right: "20px",
            top: "8px",
            color: "#213366",
            cursor: "pointer",
          }}
        >
          <i className="fa fa-times fs-3 modal-cls" aria-hidden="true"></i>
        </span>
        <div className="svg-top">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="330"
            height="405"
            viewBox="0 0 330 405"
            fill="none"
            className="sched-modal-edit-evt"
          >
            <path
              d="M192.069 338.654C43.1066 317.937 22.2553 364.484 0.00750924 404.24L7.50122e-09 20.0255C-0.000299446 8.96583 8.96523 0 20.0248 0H309.519C320.577 0 329.544 8.96583 329.544 20.0245L329.543 243.055C325.491 286.302 295.076 352.979 192.069 338.654Z"
              fill="#D6B6F9"
            />

            <defs>
              <linearGradient id="gradient-col-edit" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#F093FB" }} />
                <stop offset="100%" style={{ stopColor: "#f24570" }} />
              </linearGradient>
            </defs>
          </svg>

          <div className="upperData matched-modal">
            <h3 style={{ zIndex: "99999" }}>You’re Matched</h3>
            <p>You and Desirae have both liked each other</p>
            <div className="coll row">
              <div className="col-md-8 mod-person-lft col-8">
                <p className="fs-4 text-muted fw-600 per-txt">
                  {" "}
                  {User?.name || ""}
                </p>
                <p className="fs-4 text-muted fw-600 per-dest">
                  {" "}
                  {User?.occupation || "Marketing Manager"}
                </p>
                <p className="fs-4 text-muted fw-600 location ">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="12"
                      viewBox="0 0 8 12"
                      fill="none"
                    >
                      <path
                        d="M3.91737 0.696289C1.75734 0.696289 0 2.45151 0 4.61014C0 7.49576 3.61369 10.929 3.76886 11.0742C3.81171 11.1122 3.86501 11.1333 3.91737 11.1333C3.97067 11.1333 4.02588 11.1122 4.06682 11.0742C4.222 10.929 7.83569 7.50476 7.83569 4.61014C7.83569 2.45151 6.07834 0.696289 3.91737 0.696289ZM3.91737 6.37335C2.94444 6.37335 2.15242 5.58237 2.15242 4.61014C2.15242 3.63696 2.94444 2.84698 3.91737 2.84698C4.89124 2.84698 5.68233 3.63696 5.68233 4.61014C5.68233 5.58237 4.89124 6.37335 3.91737 6.37335Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  {User?.address || "New York, USA"}
                </p>
              </div>
              <div className="col-md-4 col-4 modal-imgg-wrap">
                <div className="girl ">
                  <img
                    src={
                      User?.mainAvatar
                      ? `${BASE_URL}/assets/images/${User?.mainAvatar}`
                      : userMale
                    }
                    alt="dating thumb"
                  />
                </div>
              </div>
            </div>

            <div className=" col6 heart-svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="23"
                viewBox="0 0 24 23"
                fill="none"
              >
                <path
                  d="M21.3406 2.97626C18.7864 0.422095 14.7424 0.178778 11.9449 2.30744C9.11644 0.208838 5.10345 0.422095 2.51825 2.97626C-0.278217 5.77375 -0.278217 10.3644 2.51825 13.1619L11.1239 21.7666L11.9139 22.5576L21.3406 13.1319C24.1681 10.3644 24.1681 5.80378 21.3406 2.97626ZM19.7897 11.611L14.1947 17.2059C13.9514 15.8072 13.2826 14.4395 12.6438 13.1319C11.154 10.061 9.87738 7.41575 12.7349 4.55723L12.9172 4.37501C14.8636 2.61082 17.9043 2.67188 19.7897 4.55723C21.7351 6.50263 21.7351 9.66556 19.7897 11.611Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="row rt2">
           
                <Fragment >
                  <div className="col-md-4 col-4 modal-imgg-wrap">
                    <img
                      className="img2 rounded-50"
                      // src={ViewUser?.selectUser?.avatar}
                      src={`${BASE_URL}/assets/images/${ViewUser?.receiverUserId?.avatars[0] }`}
                      alt={ViewUser?.selectUser?.avatar}
                    />
                  </div>
                  <div className="col-md-8 mod-person-rt col-8">
                    <p className="fs-4 text-muted fw-600 per-txt">
                      {ViewUser?.receiverUserId?.name}
                    </p>
                    <p className="fs-4 text-muted fw-600 per-dest">
                      {ViewUser?.receiverUserId?.occupation}
                    </p>
                    <p className="fs-4 text-muted fw-600 location">
                      <span className="location2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="12"
                          viewBox="0 0 8 12"
                          fill="none"
                        >
                          <path
                            d="M3.91737 0.696289C1.75734 0.696289 0 2.45151 0 4.61014C0 7.49576 3.61369 10.929 3.76886 11.0742C3.81171 11.1122 3.86501 11.1333 3.91737 11.1333C3.97067 11.1333 4.02588 11.1122 4.06682 11.0742C4.222 10.929 7.83569 7.50476 7.83569 4.61014C7.83569 2.45151 6.07834 0.696289 3.91737 0.696289ZM3.91737 6.37335C2.94444 6.37335 2.15242 5.58237 2.15242 4.61014C2.15242 3.63696 2.94444 2.84698 3.91737 2.84698C4.89124 2.84698 5.68233 3.63696 5.68233 4.61014C5.68233 5.58237 4.89124 6.37335 3.91737 6.37335Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      {ViewUser?.receiverUserId?.address}
                    </p>
                  </div>
                </Fragment>
           
            </div>
          </div>

          
            <div className="date-time-wrap">
              <p className="date-modal">
                <i className="fas fa-calendar-alt"></i>
                {ViewUser?.scheduledData?.date || "01-12-2025"}
              </p>
              <p className="time-modal">
                <i className="fas fa-clock"></i>
                {ViewUser?.scheduledData?.time || "2:00 PM"}
              </p>
              <p className="loc-modal">
                <i className="fas fa-map-marker-alt"></i>
                {ViewUser?.scheduledData?.venue || "New York"}
              </p>
            </div>
       

            <div className="main-bottom">
           <Link to="/dating/chat-page2"> 
           <button className="send-msg-btn">
              <p className="content">Send a Message</p>
            </button></Link>
            
           <Link >
             <button
             onClick={() => {calenderScheduleDAte()}}
             className="schedule-date" >
              <p className="celender schedulename">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <g clip-path="url(#clip0_2149_148)">
                    <path
                      d="M15.0417 1.58333H14.25V0.791667C14.25 0.581704 14.1666 0.38034 14.0181 0.231874C13.8697 0.0834075 13.6683 0 13.4583 0C13.2484 0 13.047 0.0834075 12.8985 0.231874C12.7501 0.38034 12.6667 0.581704 12.6667 0.791667V1.58333H6.33333V0.791667C6.33333 0.581704 6.24993 0.38034 6.10146 0.231874C5.95299 0.0834075 5.75163 0 5.54167 0C5.3317 0 5.13034 0.0834075 4.98187 0.231874C4.83341 0.38034 4.75 0.581704 4.75 0.791667V1.58333H3.95833C2.9089 1.58459 1.90282 2.00203 1.16076 2.74409C0.418698 3.48615 0.00125705 4.49224 0 5.54167L0 15.0417C0.00125705 16.0911 0.418698 17.0972 1.16076 17.8392C1.90282 18.5813 2.9089 18.9987 3.95833 19H15.0417C16.0911 18.9987 17.0972 18.5813 17.8392 17.8392C18.5813 17.0972 18.9987 16.0911 19 15.0417V5.54167C18.9987 4.49224 18.5813 3.48615 17.8392 2.74409C17.0972 2.00203 16.0911 1.58459 15.0417 1.58333ZM1.58333 5.54167C1.58333 4.91178 1.83356 4.30769 2.27895 3.86229C2.72435 3.41689 3.32844 3.16667 3.95833 3.16667H15.0417C15.6716 3.16667 16.2756 3.41689 16.721 3.86229C17.1664 4.30769 17.4167 4.91178 17.4167 5.54167V6.33333H1.58333V5.54167ZM15.0417 17.4167H3.95833C3.32844 17.4167 2.72435 17.1664 2.27895 16.721C1.83356 16.2756 1.58333 15.6716 1.58333 15.0417V7.91667H17.4167V15.0417C17.4167 15.6716 17.1664 16.2756 16.721 16.721C16.2756 17.1664 15.6716 17.4167 15.0417 17.4167Z"
                      fill="#E654A0"
                    />
                    <path
                      d="M9.5 13.0625C10.1558 13.0625 10.6875 12.5308 10.6875 11.875C10.6875 11.2192 10.1558 10.6875 9.5 10.6875C8.84416 10.6875 8.3125 11.2192 8.3125 11.875C8.3125 12.5308 8.84416 13.0625 9.5 13.0625Z"
                      fill="#E654A0"
                    />
                    <path
                      d="M5.54199 13.0625C6.19783 13.0625 6.72949 12.5308 6.72949 11.875C6.72949 11.2192 6.19783 10.6875 5.54199 10.6875C4.88615 10.6875 4.35449 11.2192 4.35449 11.875C4.35449 12.5308 4.88615 13.0625 5.54199 13.0625Z"
                      fill="#E654A0"
                    />
                    <path
                      d="M13.458 13.0625C14.1138 13.0625 14.6455 12.5308 14.6455 11.875C14.6455 11.2192 14.1138 10.6875 13.458 10.6875C12.8022 10.6875 12.2705 11.2192 12.2705 11.875C12.2705 12.5308 12.8022 13.0625 13.458 13.0625Z"
                      fill="#E654A0"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2149_148">
                      <rect width="19" height="19" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Edit Your Schedule
              </p>
            </button></Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditEventViewSchedule;
