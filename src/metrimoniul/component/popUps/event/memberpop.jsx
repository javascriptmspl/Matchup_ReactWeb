import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserData } from "../../../../assets/DummyData/userData";
import { getBySenderUserIds } from "../../../../dating/store/slice/ActivitiesSlice";
import userMale from "../../../../dating/assets/images/myCollection/user-male.jpg";
import { useDispatch, useSelector } from "react-redux";
import { MODE_METRI } from "../../../../utils";
import { BASE_URL } from "../../../../base";
const Memberpop = ({
  showModal,
  hideModal,
  calenderScheduleDAte,
  setSelectedData,
}) => {
  const dispatch = useDispatch();
  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const Store = useSelector((state) => state);
  let matchUserList = useSelector(
    (state) => Store?.activies?.Activity?.data || []
  );
  // const [favoriteContentList] = useState(UserData.slice(0, 18));
  useEffect(() => {
    dispatch(
      getBySenderUserIds({ modeid: MODE_METRI, id: user_Data.data._id })
    );
  }, [user_Data.data._id]);

  return (
    <Modal size="xl" show={showModal} onHide={hideModal} centered>
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
      <div className="section__wrapper mb-5">
        <div className="row">
          <div className="col">
            <h3 className="heading">Here's Your Matches</h3>
          </div>
        </div>

        <div className="row g-0 justify-content-center mx-12-none">
          {matchUserList.map((val, i) => (
            <div className="member__item" key={i}>
              <div
                className="member__inner member__inner-sized-hover react-main"
                onClick={() => {
                  setSelectedData(val.receiverUserId); // Only pass the user object!
                  calenderScheduleDAte();
                }}
              >
                <div className="react">
                  {/* Add your logic here */}
                  {/* <img width="25" alt="" /> */}
                </div>
                <div className="member__thumbmember_thumb">
                  <img
                    className="image23"
                    src={
                      val?.receiverUserId?.mainAvatar
                        ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                        : val?.receiverUserId?.avatars?.[0]
                        ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                        : userMale
                    }
                    alt={`${val?.receiverUserId?.imgAlt || "user"}`}
                  />
                  <span className={val?.receiverUserId?.className}></span>
                </div>
                <div className="member__content">
                  {/* <Link to={`/dating/user-profile?userID=${val.id}`}>
                  </Link> */}
                  <Link>
                    <h5>{val?.receiverUserId?.name}</h5>
                  </Link>
                  <p>
                    <span>{val?.receiverUserId?.occupation}</span> ||{" "}
                    <span>{val?.receiverUserId?.age}</span>
                  </p>
                  <p>{val?.receiverUserId?.address}</p>
                </div>

                <div className="row mt-2 match-icon-main">
                  <div className="col">
                    <Link
                      className="fs-3 ms-4"
                      to={`/dating/user-profile?userID=${val._id}`}
                    >
                      <i
                        className="fa fa-user"
                        aria-hidden="true"
                        title="Profile"
                      ></i>
                    </Link>
                  </div>

                  <div className="col">
                    <Link className="fs-3 ms-3" to="/dating/chat-page2">
                      <i
                        className="fa fa-comment"
                        aria-hidden="true"
                        title="Message"
                      ></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default Memberpop;
