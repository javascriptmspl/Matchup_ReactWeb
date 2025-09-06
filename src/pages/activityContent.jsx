  import React from "react";
import { Link } from "react-router-dom";
import userMale from "../dating/assets/images/myCollection/user-male.jpg"
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../base";


const ActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      timestamp: "2024-01-17",
      title: "Posted a new photo",
      description:
        "Shared a breathtaking sunset photo taken during a weekend hike.",
      icon: "📸",
    },
    {
      id: 2,
      timestamp: "2024-01-16",
      title: "Had a chat with John Doe",
      description:
        "Caught up with John to discuss the upcoming software release and project timelines.",
      icon: "💬",
    },
    {
      id: 3,
      timestamp: "2024-01-15",
      title: "Liked a post by Jane Doe",
      description:
        "Expressed appreciation for Jane's insightful article on the future of artificial intelligence.",
      icon: "👍",
    },
    {
      id: 4,
      timestamp: "2024-01-14",
      title: "Attended a webinar on React development",
      description:
        "Gained valuable insights into the latest React features and best practices from industry experts.",
      icon: "👩‍💻",
    },
    {
      id: 5,
      timestamp: "2024-01-13",
      title: "Updated profile information",
      description:
        "Enhanced the profile with a new profile picture and added details about recent projects.",
      icon: "✏️",
    },
    {
      id: 6,
      timestamp: "2024-01-12",
      title: "Received a job offer",
      description:
        "Thrilled to receive a job offer from a leading tech company. Exciting new opportunities ahead!",
      icon: "🎉",
    },
    {
      id: 7,
      timestamp: "2024-01-11",
      title: "Completed a coding challenge",
      description:
        "Successfully solved a challenging coding problem during the final interview.",
      icon: "💻",
    },
    {
      id: 8,
      timestamp: "2024-01-10",
      title: "Explored a new programming language",
      description:
        "Embarked on the journey of learning Python to broaden programming skills.",
      icon: "🐍",
    },
    {
      id: 9,
      timestamp: "2024-01-09",
      title: "Celebrated a friend's birthday",
      description:
        "Had an amazing time celebrating Jane's birthday with friends. Lots of laughter and fun!",
      icon: "🎂",
    },
    {
      id: 10,
      timestamp: "2024-01-08",
      title: "Started a fitness challenge",
      description:
        "Committed to a 30-day fitness challenge for better health and well-being.",
      icon: "🏋️‍♂️",
    },
  ];

  const profileData = useSelector((state) => state.profile.userData);


  const User = profileData[0];

  return (
    // <div className="activity-timeline">
    //   <h3>Activity Timeline</h3>
    //   <div className="activity-cards">
    //     {activities.map((activity) => (
    //       <div key={activity.id} className="activity-card">
    //         <div className="activity-meta">
    //           <span className="timestamp">{activity.timestamp}</span>
    //         </div>
    //         <div className="activity-details">
    //           <h5>{activity.icon}{activity.title}</h5>
    //           <p>{activity.description}</p>
    //           {/* <p>{activity.icon}</p> */}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="group__bottom--body bg-white">
      <div className="group__bottom--group">
      <h3>Activity Timelines</h3>
        <div className="activity-cards">
        {activities.map((activity) => (
            <div className="col"key={activity.id}>
               
              <div className="activity__item">
              <span className="timestamp">{activity.timestamp}</span>
                <div className="activity__inner">
                  
                  <div className="activity__thumb">
                  <img
                            src={
                              User?.mainAvatar
                                ? `${BASE_URL}/assets/images/${User?.mainAvatar}`
                                : userMale
                            }
                            alt="dating thumb"
                          />
                  </div>
                
                  <h5>{activity.icon} {activity.title}</h5>
                    <p>{activity.description}</p>
                    <p>{activity.activety}</p>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
