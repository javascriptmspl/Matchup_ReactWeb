import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import userMale from "../../../dating/assets/images/myCollection/user-male.jpg";
import { metriGetAllUsersAsync } from "../../../service/MANAGE_SLICE/find-user-SLICE";
import { useDispatch, useSelector } from "react-redux";
import { LOCAL_USER_GENDER } from "../../../utils";
import { BASE_URL } from "../../.././base";
const title = "Most Popular Members";
const desc =
  "Learn from them and try to make it to this board. This will for sure boost you visibility and increase your chances to find you loved one.";

const MemberSection = () => {
  const [members, setMembers] = useState([]);
  const [sessionInteractedUsers, setSessionInteractedUsers] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const ALL_USER_METRIMONIAL = useSelector((state) => state.getAllUser.users);
  const dispatch = useDispatch();

  const userByMode = LOCAL_USER_GENDER();

  const showuserByGender = ALL_USER_METRIMONIAL.filter(
    (member) => member.iAm !== userByMode
  );

  // Derived lists should not be used as effect dependencies directly

  useEffect(() => {
    dispatch(metriGetAllUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    const filteredMembers = showuserByGender.filter(
      (member) => !sessionInteractedUsers.includes(member._id)
    );

    setMembers(filteredMembers);
  }, [showuserByGender, sessionInteractedUsers]);

  // Remove redundant effect that caused repeated state updates

  return (
    <>
      <div className="member member--style3 padding-top ">
        <div className="container">
          <div
            className="section__header style-2 text-center wow fadeInUp"
            data-wow-duration="1.5s"
          >
            <h2>{title}</h2>
            <p>{desc}</p>
          </div>
          <div className="section__wrapper">
            <div
              className="row g-0 mx-12-none justify-content-center wow fadeInUp"
              data-wow-duration="1.5s"
            >
              {members.slice(0, 4).map((val, i) => (
                <div className="member__item" key={i}>
                  <div className="member__inner">
                    <div className="member__thumb user-full-img">
                      <img
                        src={
                          val.mainAvatar
                            ? `${BASE_URL}/assets/images/${val.mainAvatar}`
                            : val.avatars?.[0]
                            ? `${BASE_URL}/assets/images/${val.avatars[0]}`
                            : userMale
                        }
                        alt="dating thumb"
                      />
                    </div>
                    <div className="member__content">
                      <Link to={`user-profile/${val._id}`}>
                        <h5 className="text-black">{val.name || ""}</h5>
                      </Link>
                      <p>
                        {" "}
                        <small style={{ color: "#f24570" }}>
                          <i
                            class="me-2 fa fa-graduation-cap"
                            aria-hidden="true"
                          ></i>
                        </small>
                        <small className="text-black">
                          {val.occupation || ""}
                        </small>
                      </p>
                      <p>
                        {" "}
                        <small style={{ color: "#f24570" }}>
                          <i
                            class="me-2 fa fa-map-marker"
                            aria-hidden="true"
                          ></i>
                        </small>
                        <small className="text-black">{val.dob || ""}</small> ||{" "}
                        <small className="text-black">
                          {`${val.Height}ft` || ""}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberSection;
