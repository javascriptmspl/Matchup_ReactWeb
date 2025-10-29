import React, { useState, Fragment, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Pagination from "../component/section/pagination";
import Rating from "../component/section/rating";
import Categorie from "../component/sidebar/categorie";
import RecentProduct from "../component/sidebar/recent-product";
import SearchBar from "../component/sidebar/search";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";
import NotificationScheduleModal from "../component/popUps/notificationSchedule";
import CalenderScheduleModal from "../component/popUps/calenderSchedule";
import ViewScheduleModal from "./viewSchedule";
import CancelScheduleModal from "../component/popUps/cancelSchedule";
import EventHeader from "../component/layout/EventHeader";
import EventNotificationScheduleModal from "../component/popUps/eventNotificationSchedule ";
import EventCalenderScheduleModal from "../component/popUps/eventCalenderSchedule ";
import EventDeleteSchedule from "./EventDelete";
import EventViewSchedule from "./EventView";
import EditEventViewSchedule from "../pagesDating/EditEventView";
import { useDispatch, useSelector } from "react-redux";
import MyContext from "../store/context/UseContext";
import MemberPopsModal from "./memberpop";
import {
  deleteEvent,
  getEvents,
} from "../../service/common-service/eventSlice";
import toast from "react-hot-toast";
import { BASE_URL } from "../../base";
// import { UserData } from "../../assets/DummyData/userData";

const showResult = "Showing 01 - 12 of 139 Results";

const Events = (e) => {
  const [memberpopup, setMemberpopup] = useState(false);
  const [ViewSchedule, setViewSchedule] = useState(false);
  const [NotificationSchedule, setNotificationSchedule] = useState(false);
  const [calenderSchedule, setCalenderSchedule] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isListVisible, setIsListVisible] = useState(!isMobile);
  const [showClock, setShowClock] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [CancelSchedule, setCancelSchedule] = useState(false);
  const [deleteSchedule, setDeleteSchedule] = useState(false);
  const [viewEvents, setViewEvents] = useState(false);
  const [editEvents, setEditEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ViewUser, setViewUser] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const eventArray = useSelector((state) => state.eventArray);
  const [eventToDeleteIndex, setEventToDeleteIndex] = useState(null);

  const selectus = (val) => {
    setSelectedUser(val);
  };
  const selectuse = (val) => {
    setViewUser(val);
  };

  const useerData = JSON.parse(localStorage.getItem("userData"));
  const Userid = useerData.data._id;
  const dispatch = useDispatch();

  useEffect(() => {
    const getEvent = async() => {
      const res = await dispatch(getEvents(Userid));
      setStoreData(res.payload);
    };
    getEvent();
  }, [dispatch, Userid]);

 
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
    
    // Ensure we have a user selected - use existing selectedData if selectedUser is null
    if (!selectedUser && selectedData) {
      setSelectedUser(selectedData);
    }
    
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

  const viewData = (val) => {};

  // const handleDelete = () => {
  //   if (eventToDeleteIndex !== null) {
  //     const updatedStoreData = [...storeData];
  //     updatedStoreData.splice(eventToDeleteIndex, 1);

  //     // Update local storage
  //     localStorage.setItem("dataEvent", JSON.stringify(updatedStoreData.filter(Boolean)));
  //     localStorage.setItem("datanotifyEvent", "[]");

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
        const res = await dispatch(getEvents(Userid));
        setStoreData(res.payload);
        toast.success("Event deleted successfully");
        setDeleteSchedule(false);
        setEventToDeleteIndex(null);
      } else {
        toast.error("Error deleting event");
      }
    }
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
  });

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
                  setSelectedData={selectus}
                  setSelectedUser={setSelectedUser}
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
                  hideModal={() => setNotificationSchedule(false)}
                  calenderScheduleDAte={calenderScheduleDAte}
                  selectedUser={selectedUser}
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
                storeData.map(( val, i) => {

                  return (
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
                                val?.receiverUserId?.mainAvatar
                                  ? `${BASE_URL}/assets/images/${val.receiverUserId.mainAvatar}`
                                  : val?.receiverUserId?.avatars?.[0]
                                  ? `${BASE_URL}/assets/images/${val.receiverUserId.avatars[0]}`
                                  : "/assets/images/default-avatar.png"
                              }
                              alt={val?.receiverUserId?.name || "Event user"}
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
                            {val?.receiverUserId?.name}
                          </p>
                          <p className="event-date">
                            <i className="fas fa-calendar-alt"></i>
                            {val?.scheduledData?.date || "01/01/2026"}
                          </p>
                          <p className="event-loc">
                            <i className="fas fa-map-marker-alt"></i>
                            {val?.scheduledData?.venue || "New York"}
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
                  )}
                )
              ) : (
                <div className="col text-center">
                  <h5>"Events are not available. Schedule your event now!"</h5>
                </div>
              )}
            </div>
          </div>
        </div>
        {deleteSchedule !== null && (
          <EventDeleteSchedule
            showModal={deleteSchedule}
            hideModal={() => setDeleteSchedule(false)}
            onDelete={handleDelete}
          />
        )}

        <EventViewSchedule
          showModal={viewEvents}
          hideModal={() => setViewEvents(false)}
          calenderScheduleDAte={calenderScheduleDAte}
          ViewUser={ViewUser}
          scheduledData={selectedData}
        />
        <EditEventViewSchedule
          showModal={editEvents}
          hideModal={() => setEditEvents(false)}
          scheduledData={selectedData}
          ViewUser={ViewUser}
          calenderScheduleDAte={calenderScheduleDAte}
        />
      </div>
      <FooterFour />
    </Fragment>
  );
};

export default Events;
