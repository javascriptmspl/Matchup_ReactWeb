import { Fragment, useEffect, useState,useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import {Link} from "react-router-dom";
import CalenderScheduleModal from "./calenderSchedule";
import userMale from "../../assets/images/myCollection/user-male.jpg"
import toast from "react-hot-toast";
import { addToEventAsync } from "../../store/slice/shop/EventSlice";
import MyContext from "../../store/context/UseContext";
import { BASE_URL } from "../../../base";
import { createEvent, getEvents } from "../../../service/common-service/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";
// import { UserData } from "../../assets/DummyData/userData";


const NotificationSchedule = ({ showModal, hideModal,calenderScheduleDAte, selectedUser ,scheduledData , selectData, }) => {

const {eventDatahandle}=useContext(MyContext)
  const dispatch=useDispatch()

  const profileData = useSelector((state) => state.profile.userData);
  const User = profileData;   

  const eventData={
    user:User,
    selectUser:selectedUser,
    scheduledData:scheduledData,
  }

  const handleSubmitnotification = async (e) => {
    e.preventDefault();

    const payload = {
      senderUserId: User?._id || User?.id || "",
      receiverUserId: selectedUser?._id || selectedUser?.id || "",
      action_logs: "Scheduled via chat",
      description: scheduledData?.description || "1st meet",
      note: scheduledData?.note || "User scheduled a date from chat",
      mode: scheduledData?.mode || "68d103d5aa4b176726e60421",
    };

    try {
      const resultAction = await dispatch(createEvent(payload));
      const res = unwrapResult(resultAction);
      if (res.isSuccess === true) {
        dispatch(getEvents(res?.data?.senderUserId));
        toast.success("Schedule date successfully updated");
        hideModal(hideModal);
      } else {
        toast.error("Failed to schedule event");
      }
    } catch (error) {
      console.error("Promise error during createEvent:", error);
      toast.error("Failed to schedule event");
    }
  };
 
  return (
    <Modal show={showModal} onHide={hideModal} centered >
      
        
        <div className="main" style={{position:"relative"}}>
        <span onClick={hideModal} style={{position:"absolute", right:"20px", top:"8px", color: "#213366", cursor: "pointer"}}>
          <i className="fa fa-times fs-3 modal-cls" aria-hidden="true"></i>
        </span>
        <div className="svg-top" >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="330"
            height="405"
            viewBox="0 0 330 405"
            fill="none" className="sched-modal"
          >
            <path
              d="M192.069 338.654C43.1066 317.937 22.2553 364.484 0.00750924 404.24L7.50122e-09 20.0255C-0.000299446 8.96583 8.96523 0 20.0248 0H309.519C320.577 0 329.544 8.96583 329.544 20.0245L329.543 243.055C325.491 286.302 295.076 352.979 192.069 338.654Z"
              fill="#D6B6F9"
            />
            <defs>
              <linearGradient id="gradient-col" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#F093FB" }} />
                <stop offset="100%" style={{ stopColor: "#f24570" }} />
              </linearGradient>
            </defs>
          </svg>

          <div className="upperData matched-modal">
            <h3 style={{ zIndex: "999999" }}>Your Event Is Scheduled</h3>
            <p>You and Desirae have both liked each other</p>
            <div className="coll row">
              <div className="col-md-8 mod-person-lft col-8">
                <p className="fs-4 text-muted fw-600 per-txt"> {User?.name || ""}</p>
                <p className="fs-4 text-muted fw-600 per-dest"> {User?.occupation || ""}</p>
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
                  {User?.address || "Mumbai, India"}
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
              <div className="col-md-4 col-4 modal-imgg-wrap">
                <img
                  className="img2 rounded-50"
                  src={selectedUser?.avatar}
                  alt=""
                />
              </div>
              <div className="col-md-8 mod-person-rt col-8">
                <p className="fs-4 text-muted fw-600 per-txt">{selectedUser?.name||""}</p>
                <p className="fs-4 text-muted fw-600 per-dest">{selectedUser?.occupation||""}</p>
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
                  {selectedUser?.address||"Mumbai, India"}
                </p>
              </div>
            </div>
          </div>

          <div className="date-time-wrap">
            <p className="date-modal">
              <i class="fas fa-calendar-alt"></i>
              {scheduledData?. date||""}
            </p>
            <p className="time-modal">
              <i class="fas fa-clock"></i>
              {scheduledData?.time||""}
            </p>
            <p className="loc-modal">
              <i class="fas fa-map-marker-alt"></i>
              {scheduledData?. venue||""}
            </p>

          </div>


          <div className="main-bottom">
           <Link onClick={hideModal}> 
           <button className="send-msg-btn">
              <p className="content">Send a Message</p>
            </button></Link>
            
           <Link >
             <button onClick={handleSubmitnotification} className="schedule-date" >
              <p className="celender schedulename">
                Submit
              </p>
            </button></Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationSchedule;
