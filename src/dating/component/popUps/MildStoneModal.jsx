import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import SelectProduct from "../../component/select/selectproduct";
import Scrollbars from 'react-custom-scrollbars-2';

const btnText = "Load More";

const RelationshipMilestoneList = [
  {
    
    text: 'Started a beautiful journey together',
    activity: '2 days ago',
  },
  {
    text: 'Celebrated the first month of happiness',
    activity: '2 days ago',
  },
  {
    text: 'Shared special moments with each other\'s families',
    activity: '2 days ago',
  },
  {
    text: 'Embarked on a romantic trip together',
    activity: '2 days ago',
  },
  {
    text: 'Decided to share a home and move in together',
    activity: '2 days ago',
  },
  {
    text: 'Took a step forward and got engaged',
    activity: '2 days ago',
  },
  {
    text: 'Tied the knot and became a married couple',
    activity: '2 days ago',
  },
  {
    text: 'Welcomed their first bundle of joy into the world',
    activity: '2 days ago',
  },
  {
    text: 'Celebrated the joyous 5-year milestone together',
    activity: '2 days ago',
  },
  {
    text: 'Still going strong after a decade of love!',
    activity: '2 days ago',
  },
];


const RelationshipMilestoneTracker = ({ showModal, hideModal, selectedUser, filteredUser }) => {
  const [showMilestone, setShowMilestone] = useState(5);
  const totalMilStones = RelationshipMilestoneList.length;

  const handleLoadMoreMilestone = () => {
    const newMilestoneToShow = showMilestone + 5;
    setShowMilestone(Math.min(newMilestoneToShow, totalMilStones))
  }

  return (
    <>
    <style>{`
      .rb-backdrop-blur { backdrop-filter: blur(6px); background-color: rgba(0,0,0,0.35) !important; z-index: 50010 !important; }
      .modal.rb-call-modal { z-index: 50020 !important; }
    `}</style>
    <Modal className='me-2 rb-call-modal' show={showModal} onHide={hideModal} centered size="lg" backdropClassName="rb-backdrop-blur"  >
      <span onClick={hideModal}>
        <i
          className="fa fa-times fs-3"
          aria-hidden="true"
          style={{
            cursor: 'pointer',
            color: "white",
            float: 'right',
            right: "0px",
            padding: '15px 25px 0 0',
            position: 'absolute',
          }}
        ></i>
      </span>
      <div className="activity ">
        <div className="container">
          <div class="jumbotron p-lg-4 p-2 rounded-2">
            <p class="display-5">Relationship Milestone Tracker</p>
            <p class="lead">Track and celebrate the special moments in your relationship journey.</p>
          </div>
          <div className="row g-4 pb-2">
            <Scrollbars
              autoHide
              style={{ position: "relative", height: "530px" }}
            >
              <div className="col-lg-12">
                <div className="group__bottom--area">

                  <div className="group__bottom--body bg-white">
                    <div className="group__bottom--group">
                      <div className="row g-4 justify-content-center mx-12-none row-cols-1">
                        {RelationshipMilestoneList.slice(0, showMilestone).map((val, i) => (
                          <div className="col" key={i}>
                            <div className="activity__item">
                              <div className="activity__inner">
                                <div className="activity__thumb">
                                  <Link to="/member-single"><img src={filteredUser ? filteredUser.avatar : null} alt={`${val.imgAlt}`} /></Link>
                                </div>
                                <div className="activity__content">
                                  <h5>
                                    <Link to="/dating/members">{filteredUser ? filteredUser.name : null}</Link>
                                    <span>{"and "}</span>
                                    {" "} You{" "}
                                    <span>{val.text}</span>
                                  </h5>
                                  <p>{val.activity}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-5">
                        {showMilestone < totalMilStones && (
                          <a 
                          href="#" 
                          className="default-btn reverse"
                          onClick={handleLoadMoreMilestone}
                          ><span><i className="fa-solid fa-spinner"></i> {btnText}</span></a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default RelationshipMilestoneTracker;


