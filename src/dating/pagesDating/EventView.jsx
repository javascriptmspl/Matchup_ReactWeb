import React, { useState, Fragment, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import CalenderScheduleModal from "../component/popUps/calenderSchedule";
import userMale from "../assets/images/myCollection/user-male.jpg";
import toast from "react-hot-toast";
import MyContext from "../store/context/UseContext";
import { BASE_URL } from "../../base";

const EventViewSchedule = ({
  showModal,
  hideModal,
  calenderScheduleDAte,
  ViewUser,
  scheduledData,
  selectData,
}) => {
  const [storeData, setStoreData] = useState([]);

  const profileData = useSelector((state) => state.profile.userData);

  const { eventArray } = useContext(MyContext);

  const User = profileData;

  const dataEvent = localStorage.getItem("dataEvent");
  const datanotifyEvent = localStorage.getItem("datanotifyEvent");

  useEffect(() => {
    const parsedDataEvent = dataEvent ? JSON.parse(dataEvent) : [];
    const parsedDatanotifyEvent = datanotifyEvent
      ? JSON.parse(datanotifyEvent)
      : [];

    // Assuming setStoreData is a function that updates the state
    setStoreData([...parsedDataEvent, ...parsedDatanotifyEvent]);
  }, [datanotifyEvent, dataEvent]);

  // useEffect(() => {
  //   const data = localStorage.getItem("dataEvent");
  //   console.log(JSON.parse(data));
  //   setStoreData(data ? [JSON.parse(data)] : []);
  // }, []);

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
            className="sched-modal-view"
          >
            <path
              d="M192.069 338.654C43.1066 317.937 22.2553 364.484 0.00750924 404.24L7.50122e-09 20.0255C-0.000299446 8.96583 8.96523 0 20.0248 0H309.519C320.577 0 329.544 8.96583 329.544 20.0245L329.543 243.055C325.491 286.302 295.076 352.979 192.069 338.654Z"
              fill="#D6B6F9"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
              {
                <Fragment>
                  <div className="col-md-4 col-4 modal-imgg-wrap">
                    <img
                      className="img2 rounded-50"
                      // src={`${ViewUser?.selectUser?.avatar}`}
                      src={`${BASE_URL}/assets/images/${ViewUser?.receiverUserId?.avatars[0]}`}
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
              }
            </div>
          </div>

          <div className="date-time-wrap view-event">
            <p className="date-modal">
              <i className="fas fa-calendar-alt"></i>
              {ViewUser?.scheduledData?.date || "17-10-2025"}
            </p>
            <p className="time-modal">
              <i className="fas fa-clock"></i>
              {ViewUser?.scheduledData?.time || "10:00 AM"}
            </p>
            <p className="loc-modal">
              <i className="fas fa-map-marker-alt"></i>
              {ViewUser?.scheduledData?.venue || "City garden "}
            </p>
          </div>

          <div className="main-bottom">
            {/* <Link onClick={hideModal}> 
           <button className="send-msg-btn">
              <p className="content">Send a Message</p>
            </button></Link>
            
           <Link >
             <button onClick={handleSubmit} className="schedule-date" >
              <p className="celender schedulename">
                Submit
              </p>
            </button></Link> */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventViewSchedule;
