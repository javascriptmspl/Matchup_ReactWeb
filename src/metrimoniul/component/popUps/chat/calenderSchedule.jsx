import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import Timer from './Timer'
import TimerMetri from "./Timer";

const CalenderScheduleMetri = ({
  showModal,
  hideModal,
  
  
}) => {
  const [showClock, setShowClock] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTime,setSelectedTime] =useState(new Date())


  const handleClockClick = () => {
    setShowClock(!showClock);
    setShowCalendar(!showCalendar)
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

 const venues = [
   {  address:'Empire State Building, 20 W 34th St New York, NY 10001' },
   {  address:'Times Square , Manhattan, NY 10036' },
   {  address:'Statue of Liberty,  New York, NY 10004' },
   {  address:'Brooklyn Bridge,  New York, NY 10038' },
   {  address:'The Metropolitan Museum of Art,  1000 5th Ave, New York, NY 10028' },
   {  address:'Grand Central Terminal,  89 E 42nd St, New York, NY 10017' },
   {  address:'Central Park,  59th St to 110th St, New York, NY 10022' },
  // Add more venues as needed
];

const VenuePopup = ({ selectedVenue, onClose }) => (
  <div className="popup-venue">
    <span className="close" onClick={onClose}>&times;</span>
    <p> <i class="fa-solid fa-location-dot fa-xl" style={{color:"#B197FC"}}></i> {selectedVenue.address}</p>
  </div>
);
// ----------------venue---------------
// const VenuePicker = () => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handlePickVenue = () => {
    const randomIndex = Math.floor(Math.random() * venues.length);
    const chosenVenue = venues[randomIndex];
    setSelectedVenue(chosenVenue);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
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
              style={{ position: "absolute", right: "10px", top: "5px" }}
            >
              <i className="fa fa-times fs-3" aria-hidden="true"></i>
            </span>

            <div className="Data-1">
              <h5 className="fs-4 text-muted fw-700">
                Schedule Your Virtual Date for Meaningful Connections!
              </h5>
              <div className="settime">
              
               <TimerMetri/>
                <span className="clock-icon" onClick={onClick} value={value}   >
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

              <div className="setVenue">
              <input
                  className="date"
                  type=""
                  placeholder="Choose Venue"
                  onClick={handlePickVenue}
                />
                 <div className='Apps'>
     
     {isPopupOpen && selectedVenue && (
       <VenuePopup selectedVenue={selectedVenue} onClose={handleClosePopup} />
     )}
   </div>
                 <span className="calander-icon" onClick={handlePickVenue}>
                 <i class="fa-solid fa-location-dot fa-xl" style={{color:"#B197FC"}}></i>
                </span>
                
              </div>
            </div>
          </div>
          <div className="btn" onClick={handleSubmit}>
            <button  className="date-btn">
              <p className="date-content">Schedule Date</p>
            </button>
          </div>
        </>
          ) : showClock ? (
            <div className="clockArea">
            
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

export default CalenderScheduleMetri;
