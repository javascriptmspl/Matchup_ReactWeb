import React, { useState, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderFour from "../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import EventNotificationScheduleModal from "../component/popUps/event/eventNotificationSchedule ";
import EventCalenderScheduleModal from "../component/popUps/event/eventCalenderSchedule ";
import EventDelete from "../component/popUps/event/EventDelete";
import { useDispatch, useSelector } from "react-redux";
import MemberPopsModal from "../component/popUps/event/memberpop";
import EventHeader from "../component/layout/EventHeader";
import EditEventViewSchedule from "../component/popUps/event/EditEventView";
import EventViewSchedule from "../component/popUps/event/EventView";
// import userMale from "../../dating/assets/images/myCollection/user-male.jpg";
import { BASE_URL } from "../../base";
import {
  deleteEvent,
  getEventsM,
} from "../../service/common-service/eventSlice";
import toast from "react-hot-toast";

const showResult = "Showing 01 - 12 of 139 Results";

const Events = (e) => {
  const [memberpopup, setMemberpopup] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [ViewUser, setViewUser] = useState([]);
  const [NotificationSchedule, setNotificationSchedule] = useState(false);
  const [calenderSchedule, setCalenderSchedule] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [showClock, setShowClock] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [deleteSchedule, setDeleteSchedule] = useState(false);
  const [viewEvents, setViewEvents] = useState(false);
  const [editEvents, setEditEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const eventArray = useSelector((state) => state.event?.eventArray);
  const [eventToDeleteIndex, setEventToDeleteIndex] = useState(null);

  // Add a state to hold the selected member for scheduling
  const [selectedMemberForEvent, setSelectedMemberForEvent] = useState(null);

  const selectus = (val) => {
    setSelectedUser(val);
  };
  const selectuse = (val) => {
    setViewUser(val);
  };

  // const dataEvent = localStorage.getItem("dataEvent");
  // const datanotifyEvent = localStorage.getItem("datanotifyEvent");

  // useEffect(() => {
  //   const parsedDataEvent = dataEvent ? JSON.parse(dataEvent) : [];
  //   // const parsedDatanotifyEvent = datanotifyEvent ? JSON.parse(datanotifyEvent) : [];
  //   // Check for null values before using the spread operator
  //   setStoreData([...parsedDataEvent]);
  // }, [dataEvent]);

  const useerData = JSON.parse(localStorage.getItem("userData"));
  const Userid = useerData.data._id;

  const dispatch = useDispatch();

  useEffect(() => {
    const getEventM = async () => {
      const res = await dispatch(getEventsM(Userid));
      // Check for null values before using the spread operator
      setStoreData(res.payload);
    };
    getEventM();
  }, []);

  useEffect(() => {
    if (eventArray && eventArray.length > 0) {
      setStoreData(eventArray);
    }
  }, [eventArray]);

  const clockTime = () => {
    setCalenderSchedule(false);
    setTimeout(() => {
      setShowClock(true);
    }, 500);
  };

  const calenderDate = () => {
    setCalenderSchedule(false);
    setTimeout(() => {
      setShowCalendar(true);
    }, 500);
  };

  const userInfoDate = (data) => {
    setMemberpopup(false);
    setEditEvents(false);
    setTimeout(() => {
      setNotificationSchedule(true);
    }, 500);
  };
  const NotifyScheduleData = (data) => {
    setSelectedData(data);
    setCalenderSchedule(false);
    setTimeout(() => {
      setNotificationSchedule(true);
    }, 500);
  };

  const calenderScheduleDAte = () => {
    setMemberpopup(false);
    setNotificationSchedule(false);
    setEditEvents(false);
    setTimeout(() => {
      setCalenderSchedule(true);
    }, 500);
  };

  // const handleDelete = () => {
  //   if (eventToDeleteIndex !== null) {
  //     const updatedStoreData = [...storeData];
  //     updatedStoreData.splice(eventToDeleteIndex, 1);

  //     // Update local storage
  //     localStorage.setItem(
  //       "dataEvent",
  //       JSON.stringify(updatedStoreData.filter(Boolean))
  //     );
  //     // localStorage.setItem("datanotifyEvent", "[]");

  //     // Update state
  //     setStoreData(updatedStoreData);
  //     setDeleteSchedule(false);
  //     setEventToDeleteIndex(null);
  //   }
  // };

  const handleDelete = async () => {
    if (eventToDeleteIndex !== null) {
      const eventId = storeData[eventToDeleteIndex]._id;
      const res = await dispatch(deleteEvent(eventId));
      if (res.payload) {
        const res = await dispatch(getEventsM(Userid));
        setStoreData(res.payload);
        toast.success("Event deleted successfully");
        setDeleteSchedule(false);
        setEventToDeleteIndex(null);
      } else {
        toast.error("Error deleting event");
      }
    }
  }; 

 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
  });

  const handleMemberSelected = (val) => {
    setSelectedUser(val); // for modal
    setSelectedMemberForEvent(val); // for event creation
  };

  return (
    <Fragment>
      <HeaderFour />
      <EventHeader />
      <div className="shop-page  padding-bottom aside-bg">
        <div className="container-fluid">
          <div className="event-main-wrapper row">
            <div className="event-btnn">
              <div className="default-btn reverse col-lg-2 col-md-4 col-sm-4  text-center ">
                <button onClick={setMemberpopup}>Schedule Date</button>

                <MemberPopsModal
                  showModal={memberpopup}
                  setSelectedData={handleMemberSelected}
                  hideModal={() => setMemberpopup(false)}
                  EventCalenderScheduleModal={EventCalenderScheduleModal}
                  calenderScheduleDAte={calenderScheduleDAte}
                />
                <EventCalenderScheduleModal
                  showModal={calenderSchedule}
                  hideModal={() => setCalenderSchedule(false)}
                  calenderDate={calenderDate}
                  NotifyScheduleData={NotifyScheduleData}
                  clockTime={clockTime}
                />
                <EventNotificationScheduleModal
                  showModal={NotificationSchedule}
                  editIndex={editIndex}
                  setEditIndex={setEditIndex}
                  ViewUser={ViewUser}
                  hideModal={() => setNotificationSchedule(false)}
                  calenderScheduleDAte={calenderScheduleDAte}
                  selectedUser={selectedUser}
                  selectedMemberForEvent={selectedMemberForEvent}
                  userInfoDate={userInfoDate}
                  scheduledData={selectedData}
                />
              </div>
            </div>

            <div
              div
              className="row g-4 justify-content-center row-cols-lg-4 row-cols-sm-2 row-cols-1 event-main-wrap"
            >
              {storeData && storeData.length > 0 ? (
                storeData.map((val, i) => (
                  <div className="col" key={i}>
                    <div className="story__item style2 story--theme-color">
                      <div className="story__inner">
                        <div className="story__thumb position-relative">
                          <Link
                            onClick={() => {
                              setViewEvents(true);
                              selectuse(val);
                            }}
                          >
                            <img
                              
                              src={
                                val?.receiverUserId?.avatars?.[0]
                                  ? `${BASE_URL}/assets/images/${val.receiverUserId.avatars[0]}`
                                  : val.receiverUserId?.avatars?.[0]
                                  ?  val?.mainAvatar
                                  :`${BASE_URL}/assets/images/${val.receiverUserId?.mainAvatar}`
                              }
                              
                                
                              alt={val?.receiverUserId?.name || "user"}
                            />
                          </Link>
                          <span className="member__activity member__activity--ofline">
                            2 days ago.
                          </span>
                        </div>
                        <div className="story__content px-0 pb-0">
                          <Link
                            onClick={() => {
                              setViewEvents(true);
                              selectuse(val);
                            }}
                          >
                            <h4>{val?.receiverUserId?.name}</h4>
                          </Link>
                          <p>
                            Your meeting is scheduled with{" "}
                            {val?.senderUserId?.name}
                          </p>
                          <p className="event-date">
                            <i className="fas fa-calendar-alt"></i>
                            {val?.scheduledData?.date} || "03/10/2025"
                          </p>
                          <p className="event-loc">
                            <i className="fas fa-map-marker-alt"></i>
                            {val?.senderUserId?.venue}{" "}|| "New York"
                          </p>
                        </div>

                        <div className="edit-event">
                          <button
                            onClick={() => {
                              setViewEvents(true);
                              selectuse(val);
                            }}
                          >
                            <div className="view event-edit-btn">
                              <i className="fas fa-eye"></i>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setEditEvents(true);
                              selectuse(val);
                              setEditIndex(i);
                            }}
                          >
                            <div className="edit event-edit-btn">
                              <i className="far fa-edit"></i>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setEventToDeleteIndex(i);
                              setDeleteSchedule(true);
                            }}
                          >
                            <div className="dell event-edit-btn">
                              <i class="fas fa-trash-alt"></i>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col text-center">
                  <h5>"Events are not available. Schedule your event now!"</h5>
                </div>
              )}
            </div>
          </div>
        </div>
        {deleteSchedule !== null && (
          <EventDelete
            showModal={deleteSchedule}
            hideModal={() => setDeleteSchedule(false)}
            onDelete={handleDelete}
          />
        )}
        <EditEventViewSchedule
          showModal={editEvents}
          hideModal={() => setEditEvents(false)}
          ViewUser={ViewUser}
          scheduledData={selectedData}
          calenderScheduleDAte={calenderScheduleDAte}
        />
        <EventViewSchedule
          showModal={viewEvents}
          hideModal={() => setViewEvents(false)}
          calenderScheduleDAte={calenderScheduleDAte}
          ViewUser={ViewUser}
          // scheduledData={selectedData}
        />
      </div>
      <FooterFour />
    </Fragment>
  );
};

export default Events;
