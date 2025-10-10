import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import Clock from 'react-digital-clock';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-datepicker';
import Timer from './Timer'
import VenuePicker from './Venue'
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../base";
import userMale from "../../../dating/assets/images/myCollection/user-male.jpg";



const EventCalenderSchedule = ({showModal,hideModal,NotifyScheduleData,selectedUser}) => {
  const [showClock, setShowClock] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTime,setSelectedTime] =useState(new Date())
  const [NotificationSchedule, setNotificationSchedule] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState("");

  const handleClockClick = () => {
    setShowClock(!showClock);
    setShowCalendar(!showCalendar)
  };

  const handleVenueChange = (venue) => {
    setSelectedVenue(venue);
  };
  
  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

 
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
   
  };

  const handleTimeChange = (time)=>{
    setSelectedTime(time);
    setShowClock(false)
    
  }
  const handleSubmit =  (e) => {
    e.preventDefault();
    try {
      const scheduledData = {
        date: selectedDate.toLocaleDateString(),
        time: selectedTime.toLocaleTimeString(),
        venue: selectedVenue,
      };
      NotifyScheduleData(scheduledData);
      toast.success("schedule date successfully updated");
      //  setButtonClass("default-btn reverse");
      hideModal(hideModal)
    } catch (error) {
      console.error("Error updating Contact profile:", error);
      toast.error("Failed to update Contact info");
    }
  };
  
  const [value, setValue] = useState('10:00');

  const onClick = (time) => {
    setValue(time);
 };



  
  return (
    <Modal show={showModal} onHide={hideModal} centered>
      {!showCalendar ? (
        <>
          <div
            className="main-calander"
            style={{ position: "relative", padding: "20px" }}
          >
            <span
              onClick={hideModal}
              style={{ position: "absolute", right: "25px", top: "10px", cursor: "pointer", color: "#213366" }}
            >
              <i className="fa fa-times fs-3" aria-hidden="true"></i>
            </span>

            <div className="Data-1 cstm-modal">
              <div className="user-info text-center mb-3">
                {selectedUser && (
                  <>
                    <img
                      src={
                        selectedUser?.receiverUserId?.mainAvatar
                          ? `${BASE_URL}/assets/images/${selectedUser.receiverUserId.mainAvatar}`
                          : selectedUser?.receiverUserId?.avatars?.[0]
                          ? `${BASE_URL}/assets/images/${selectedUser.receiverUserId.avatars[0]}`
                          : userMale
                      }
                      alt="User"
                      className="rounded-circle mb-2"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <h6 className="text-muted">{selectedUser?.receiverUserId?.name || "User"}</h6>
                  </>
                )}
              </div>
              <h5 className="fs-4 text-muted fw-700">
                Schedule Your Virtual Date for Meaningful Connections!
              </h5>
              <div className="settime">
              
               <Timer/>
                <span className="clock-icon" onClick={onClick} value={selectedTime.toLocaleTimeString()}   >
                <i class="fa-solid fa-clock fa-xl" style={{color:"#B197FC"}}></i>
                </span>
              </div>
              <div className="setdate">
                <input
                  className="date"
                  type=""
                  dateFormat="DD/MM/YYYY"
                  placeholder="Choose Date"
                  value={selectedDate.toLocaleDateString()}
                  onClick={handleCalendarClick}
                />
                <span className="calander-icon" onClick={handleCalendarClick}>
                <i class="fa-regular fa-calendar-days fa-xl" style={{color:"#B197FC"}}></i>
                </span>
              </div>
                <div>
                <VenuePicker onVenueChange={handleVenueChange} />
                </div>
            </div>
          </div>
     
          <div className="sched-button" onClick={(e) => {
              e.preventDefault();
              NotifyScheduleData();
              handleSubmit(e);
            }}>
            <button  className="date-btn">
              <p className="date-content">Schedule Date</p>
            </button>
          </div>
      
        </>
          ) : showClock ? (
            <div className="clockArea" value={selectedTime}>
            
            </div>
            
      ) : (
        <div className="calenderArea">
          <Calendar
            dateFormat="DD/MM/YYYY"
            onChange={handleDateChange}
            value={selectedDate}
          
          />
        </div>
      )}
      
    </Modal>
  );
};

export default EventCalenderSchedule;
