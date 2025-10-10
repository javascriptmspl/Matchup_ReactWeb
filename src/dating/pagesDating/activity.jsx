import React, { useEffect } from "react";
import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import SelectProduct from "../../component/select/selectproduct";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivies } from "../store/slice/ActivitiesSlice";
import ActivityTimeline from "../pagesDating/activityContent";
const btnText = "Load More";

let ActivityPageContentList = [
  {
    imgUrl: "../assets/images/member/home2/01.jpg",
    imgAlt: "Dating Thumb",
    name: "Daniel Becker",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/02.jpg",
    imgAlt: "Dating Thumb",
    name: "Thorsten Schwab",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/03.jpg",
    imgAlt: "Dating Thumb",
    name: "Leah Friedman",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/04.jpg",
    imgAlt: "Dating Thumb",
    name: "Maximilian Schmidt",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/05.jpg",
    imgAlt: "Dating Thumb",
    name: "Michelle Foerster",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/06.jpg",
    imgAlt: "Dating Thumb",
    name: "Tom Frankfurter",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/07.jpg",
    imgAlt: "Dating Thumb",
    name: "Karolin Thalberg",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/08.jpg",
    imgAlt: "Dating Thumb",
    name: "Christian Nadel",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/09.jpg",
    imgAlt: "Dating Thumb",
    name: "Stefanie Farber",
    text: "became a registered member",
    activety: "2 days ago",
  },
  {
    imgUrl: "../assets/images/member/home2/10.jpg",
    imgAlt: "Dating Thumb",
    name: "Christine Winkel",
    text: "became a registered member",
    activety: "2 days ago",
  },
];
const ActivityPage = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.activies);
  useEffect(() => {
    dispatch(getAllActivies());
  }, [dispatch]);

 
  
  
   

  return (
    <Fragment>
      <div className="container activity-main-info">
        <div className="row g-4">
          <div className="col-lg-12 mob-pad">
            <div className="group__bottom--area">
              <div className="group__bottom--head row">
                <div className="left col-md-7">
                  <form action="#">
                    <input
                      type="text"
                      name="search"
                      placeholder="search"
                      className=""
                    />
                    <button type="submit">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </form>
                </div>
                <div className="right col-md-5">
                  <p>Order By:</p>
                  <div className="banner__inputlist">
                    <SelectProduct select={"Newest"} />
                  </div>
                </div>
              </div>
              <div className="group__bottom--body bg-white"> {/* Change background color */}
                <div className="group__bottom--group">
                  <div className="row g-4 justify-content-center mx-12-none row-cols-1">
                    {state.activies.map((val, i) => (
                      <div className="col" key={i}>
                        <div className="activity__item">
                          <div className="activity__inner">
                            <div className="activity__thumb">
                              <Link to="/member-single">
                                <img
                                  src=" ../assets/images/member/home2/08.jpg"
                                  alt={`Pic`}
                                />
                              </Link>
                            </div>
                            <div className="activity__content">
                              <h5>
                                <span className="icon-3d">{val.type}</span> {/* Apply 3D effect to icon */}
                              </h5>
                              <p>{val.details}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="user-profile">
                    <ActivityTimeline  />
                  </div>
                  <div className="text-center load-more-btn">
                    <Link to="#" className="default-btn reverse">
                      <span>
                        <i className="fa-solid fa-spinner"></i> {btnText}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ActivityPage;
