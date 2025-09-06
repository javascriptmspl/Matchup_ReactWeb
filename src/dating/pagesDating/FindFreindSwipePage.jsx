import React, { useState, useEffect } from "react";
import Hammer from "hammerjs";
import "./findPartner2/swiper.css";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";
import { LOCAL_USER_GENDER } from "../../utils";
import { BASE_URL } from "../../base";
// import axios from "axios";
// import SelectProduct from "../component/select/selectproduct";
import { useNavigate } from "react-router-dom";
import SearchFilterModal from "../component/popUps/searchModal";
import { useDispatch } from "react-redux";
import { createActivity, fetchUsersByGender, getFilteredUsers } from "../../service/common-service/getuserbyGender";
// import { getFindPartnerAPI } from "../../service/MANAGE_API/find-user-API";
import { metriGetAllUsersAsync } from "../../service/MANAGE_SLICE/find-user-SLICE";
import { log } from "handlebars/runtime";
import { fetchPotentialUsers } from "../../service/common-service/find-patner";

function FindFriendPageNew() {
  const [members, setMembers] = useState([]);
  const userByMode = LOCAL_USER_GENDER();
  // const [sessionInteractedUsers, setSessionInteractedUsers] = useState([]);
  // const [membersbygennder, setMembersbygender] = useState([]);
  const [photoStyle, setPhotoStyle] = useState({
    transform: "",
    transitionDuration: "",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterModal, setFilterModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const User = JSON.parse(localStorage.getItem("userData"))
  const modeId = User?.data?.mode;
  const userId = User?.data?._id;
  const findUser = User?.data?.looking;
  // filter members - with null check
  const showUserByGender = members?.length ? members.filter(
    (member) => member.iAm !== userByMode
  ) : [];


  useEffect(() => {
    const myfun = async () => {
      if (User && User?.data) {
        try {
          const response = await dispatch(
            fetchPotentialUsers({ userId, modeId })
          ).unwrap();
          setMembers(response?.data); 
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      } else {
        // const res = await dispatch(metriGetAllUsersAsync()).unwrap();
        // setMembers(res);
      }
    }
    myfun()
  },[])


  useEffect(() => {
    const el = document.querySelector(".photo-swiper");
    if (el) {
      const hammerTime = new Hammer(el);
      hammerTime.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      hammerTime.get("pinch").set({ enable: true });

      hammerTime.on("panend", function (ev) {
        el.classList.remove(
          "nope-swiper",
          "like-swiper",
          "super_like-swiper",
          "moving"
        );

        // Handle swipes
        if (ev.deltaX > 80 || ev.deltaX < -80 || ev.deltaY < -72) {
        }
      });

      hammerTime.on("pan", function (ev) {
        el.classList.add("moving");
        el.classList.toggle("nope-swiper", ev.deltaX < -80);
        el.classList.toggle("like-swiper", ev.deltaX > 80);
        el.classList.toggle(
          "super_like-swiper",
          ev.deltaY < -72 && Math.abs(ev.deltaX) < 80
        );

        const rotate = ev.deltaX * ev.deltaY * 4e-4;

        setPhotoStyle({
          transform: `translate(${ev.deltaX}px, ${ev.deltaY}px) rotate(${rotate}deg)`,
        });
      });

      // ... (Rest of your hammerTime event listeners)
    }

    return () => {
      // Clean up if needed
    };
  }, [members, currentIndex]);

  const handleSwipe = () => {
    const newIndex = (currentIndex + 1) % showUserByGender.length;
    setCurrentIndex(newIndex);
  };

  const calculateAge = (dob) => {
    const currentDate = new Date();
    const birthDate = new Date(dob);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const repeat = (transitionDuration = 350) => {
    setTimeout(() => {
      setPhotoStyle({
        transform: "",
        transitionDuration: "",
      });
      setTimeout(() => {
        const el = document.querySelector(".photo-swiper");
        if (el) {
          el.classList.remove(
            "nope-swiper",
            "like-swiper",
            "super_like-swiper",
            "moving"
          );
          setPhotoStyle({
            opacity: 1,
          });
        }
      }, transitionDuration);
    }, transitionDuration);
  };


  const buttonEvent = async (reaction) => {
    const el = document.querySelector(".photo-swiper");
    if (el) {
      const transitionDuration = Math.random() * 500 + 500;
      el.style.transitionDuration = `${transitionDuration}ms`;
  
      let x = Math.random() * 500 + 100;
      let y = Math.random() * 1000 - 200;
      let rotate = (x * y * 4e-4) / (Math.abs(x) + Math.abs(y));
  
      if (reaction === "like") {
        el.classList.toggle("like-swiper");
      } else if (reaction === "dislike") {
        el.classList.toggle("nope-swiper");
        x *= -1;
      } else if (reaction === "super_like") {
        el.classList.toggle("super_like-swiper");
        x = rotate = 0;
        y = y < 0 ? y * 3 : -y * 3;
      }
  
      // 🔹 Animate swipe
      setPhotoStyle({
        transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
        opacity: 0,
      });
  
      repeat(transitionDuration * 0.8);
  
      // 🔹 Only hit API if NOT dislike
        try {
          // First: create activity
          await dispatch(
            createActivity({
              senderUserId: userId,
              receiverUserId: showUserByGender[currentIndex]?._id,
              action_logs: `User ${user?._id} ${reaction} User ${showUserByGender[currentIndex]?._id}`,
              description: `${reaction} Action`,
              note: "",
              mode: modeId,
              activityType: reaction,
            })
          ).unwrap();
  
          // Second: refresh potential users
          const response = await dispatch(
            fetchPotentialUsers({ userId, modeId })
          ).unwrap();
  
          setMembers(response?.data || response);
        } catch (err) {
          console.error("API Error in buttonEvent:", err);
        }
  
      setTimeout(() => {
        handleSwipe();
      }, 400);
    }
  };
  
  


  const user = showUserByGender[currentIndex];

  // const languages = [
  //   { id: 1, name: "English" },
  //   { id: 2, name: "Spanish" },
  //   { id: 3, name: "Mandarin Chinese" },
  //   { id: 4, name: "French" },
  //   { id: 5, name: "Hindi" }
  // ];

  const dummyInterests = [
    { name: "Movies" },
    { name: "Music" },
    { name: "Travel" },
    { name: "Food" },
    { name: "Sports" },
  ];

const userInterests = showUserByGender[currentIndex]?.interest ?? dummyInterests;


      const handleFilterSearch = async (filters) => {
        try {
          const response = await dispatch(
            getFilteredUsers({
              ...filters,
              userId,   
              modeId,  
              location: filters.address // or however you map location
            })
          ).unwrap();
      
          if (response?.data && response.data.length > 0) {
            setMembers(response.data);
          } else {
            // fallback flow
            const res = await dispatch(
              fetchPotentialUsers({ userId, modeId })
            ).unwrap();
            setMembers(res?.data);
          }
        } catch (err) {
          console.error("Filter API Error:", err);
        }
      };
      




  return (
    <>
      <HeaderFour />
      {members?.length === 0 ? (
        // No users found design
        <div
          className="no-users-found d-flex flex-column align-items-center justify-content-center"
          style={{
            minHeight: "60vh",
            textAlign: "center",
            color: "#f24570",
          }}
        >
          <i
            className="fa fa-user-times"
            style={{ fontSize: "5rem", marginBottom: "20px" }}
          ></i>
          <h2>No Users Found</h2>
          <p>Try adjusting your search filters or check back later.</p>
        </div>
      ) : (
        <div className="container-fluid" style={{
          background: "#fff"
        }} >
          <div className="container" >
            <div className="row">
              <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <div className="smartphone-swiper my-lg-3 my-lx-3 my-md-3">
                  <div className="screen-swiper">
                    <div className="topbar-swiper">
                      <div className="topbar-left-swiper">
                        <div className="clock-swiper">00:00</div>
                        <i className="fa fa-youtube-play"></i>
                      </div>
                      <div className="topbar-middle-swiper">
                        <div className="camera-swiper"></div>
                        <div className="camera-lens-swiper"></div>
                        <div className="inner-lens-swiper"></div>
                      </div>
                      <div className="topbar-right-swiper">
                        <i className="fa fa-signal"></i>73%
                        <i className="fa fa-battery-three-quarters"></i>
                      </div>
                    </div>
                    <nav className="navbar-swiper">
                      <i className="fa-solid fa-circle-user"></i>
                      <i className="fa-solid fa-fire-flame-curved"></i>
                      <i className="fa-solid fa-comment-dots"></i>
                    </nav>
                    <div className="person-swiper">
                      <figure
                        className="photo-swiper"
                        style={{
                          ...photoStyle,
                          background: `url(${BASE_URL}/assets/images/${showUserByGender[currentIndex]?.avatars[0]})`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <div className="personal-swiper">
                          <div className="name-age-swiper">
                            <h2 className="name-swiper text-light"
                              onClick={() => navigate(`/dating/user-profile/${showUserByGender[currentIndex]?._id}`)}>{showUserByGender[currentIndex]?.name}</h2>
                            <h2 className="age-swiper text-light"> {calculateAge(showUserByGender[currentIndex]?.dob)}</h2>
                          </div>
                          <div className="data-swiper">
                            <div className="about-swiper">
                              <div className="about-icon-swiper">
                                <i className="fa-solid fa-location-dot"></i>
                              </div>
                              <div className="about-text-swiper">
                                <p>4 miles away</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </figure>
                    </div>
                    <div className="commands-swiper">
                      <div
                        className="command-swiper"
                        onClick={() => buttonEvent("dislike")}
                      >
                        <i className="fa-solid fa-close" style={{
                          color: '#41444B'
                        }}></i>
                      </div>
                      <div
                        className="command-swiper"
                        onClick={() => buttonEvent("superlike")}
                      >
                        <i className="fa-solid fa-star"
                          style={{
                            color: '#387ADF'
                          }}></i>
                      </div>
                      <div
                        className="command-swiper"
                        onClick={() => buttonEvent("like")}
                      >
                        <i className="fa-solid fa-heart" style={{
                          color: '#EF4B4B'
                        }}></i>
                      </div>
                    </div>
                    <footer className="footer-swiper">
                      <i className="fa fa-reorder"></i>
                      <i className="fa fa-square-o"></i>
                      <i className="fa fa-chevron-left"></i>
                    </footer>
                  </div>
                </div>
              </div>

              <div className="col-sm-12 col-md-7 col-lg-7 col-xl-7">
                <div className="content-swiper my-3 pe-lg-3 pe-xl-3">

                  <div className="member__info--left group__bottom--head "
                  >
                    <SearchFilterModal
                      showModal={filterModal}
                      hideModal={() => {setFilterModal(false);}}
                      onSubmit={handleFilterSearch}
                    />
                    <div className="member__info--filter">
                      <div className="default-btn">
                        <span onClick={() => setFilterModal(true)}>
                          Filter Your Search <i className="fa-solid fa-sliders"></i>
                        </span>
                      </div>
                    </div>
                    <div className="">
                      <div className="left">
                        <form
                          action="#"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <input
                            className="bg-white"
                            type="text"
                            name="search"
                            placeholder="search"
                            autocomplete="off"
                          // value={searchInputQuery}
                          // onChange={(e) => setSearchInputQuery(e.target.value)}
                          // style={{float:"left"}}
                          />
                          {/* Corrected button type */}
                          <button type="submit">
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>



                  <h3 className="mt-5">Interests</h3>
                  <div className="d-flex flex-wrap">
                      {userInterests && userInterests.length > 0 ? (
                      userInterests.map((interest, index) => (
                        <div className="col-auto" key={index}>
                          <p
                            style={{
                              margin: "10px 10px 10px 10px",
                              padding: "5px 12px",
                              borderRadius: "25px",
                              cursor: "pointer",
                              background: "#f24570",
                              color: "white",
                            }}
                            className={`interest-item flex-nowrap `}
                          >
                            {interest?.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No interests available</p>
                    )}
                  </div>


                  <h3 className="mt-5">Other details</h3>
                  <div className="d-flex flex-wrap mt-3">
                    <div className="px-3 col-6">
                      <p className=""><b style={{ color: "#213366" }}><i class="fa fa-graduation-cap" aria-hidden="true"></i> Education :</b>  {user?.education}</p>
                    </div>
                    <div className="px-3 col-6">
                      <p className=""><b style={{ color: "#213366" }}><i class="fa fa-home" aria-hidden="true"></i> Hometown :</b>  {user?.address}</p>
                    </div>
                    <div className="px-3 col-6">
                      <p className=""><b style={{ color: "#213366" }}><i class="me-1 fa fa-language" aria-hidden="true"></i>
                        Language I know :</b></p>
                      <div className="d-flex flex-wrap">
                        {/* {
                          languages ? (
                            languages.map((val, index) => ( */}
                              <div className="col-auto" 
                              // key={index}
                              >
                                <p
                                  style={{
                                    margin: "5px 5px",
                                    padding: "3px 5px",
                                    borderRadius: "25px",
                                    cursor: "pointer",
                                    background: "",
                                    border: "1px solid #f24570",
                                    fontSize: "0.8rem",
                                    color: ""
                                  }}
                                  className={`interest-item flex-nowrap text-muted`}
                                ><b>
                                    {showUserByGender[currentIndex]?.motherTongue}
                                  </b>
                                </p>
                              </div>
                            {/* ))
                          ) : (
                            <p>No Language available</p>
                          )} */}
                      </div>
                    </div>
                  </div>




                </div>
              </div>

              {/* <div className="col-lg-2 col-xl-2"></div> */}

            </div>
          </div>
        </div>
      )}
      <FooterFour />
    </>
  );
}

export default FindFriendPageNew;
