import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FooterFour from "../../component/layout/footerFour";
import HeaderFour from "../../component/layout/HeaderFour";
import SelectProduct from "../component/select/selectproduct";
import toast from "react-hot-toast";
import { BASE_URL } from "../../base";
import axios from "axios";
import SearchFilterModal from "../component/popUps/searchModal";
import { LOCAL_USER_GENDER, modeId } from "../../utils";

const MembersPage = () => {
  const isAuthenction = useSelector((state) => state.userCreate.isAuth);

  const [members, setMembers] = useState([]);
  const [membersbygennder, setMembersbygender] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchInputQuery, setSearchInputQuery] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [sessionInteractedUsers, setSessionInteractedUsers] = useState([]);

  const userByMode = LOCAL_USER_GENDER();

  const showUserByGender = members.filter(
    (member) => member.iAm !== userByMode
  );

  const tempRemoveUsers = showUserByGender.filter(
    (member) => !sessionInteractedUsers.includes(member._id)
  );

  const getAllUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/User/getall/${modeId}?page_no=$1&page_size=100`
      );
      console.log("loggg", response);
      setMembers(response.data.data.splice(0, 15));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching members:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMembersbygender(tempRemoveUsers);
  }, [sessionInteractedUsers, tempRemoveUsers]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const toastLove = (_id) => {
    setSessionInteractedUsers((prevUsers) => [...prevUsers, _id]);
    toast.success("You've got a new admirer! 💖");
  };

  const toastStar = (_id) => {
    setSessionInteractedUsers((prevUsers) => [...prevUsers, _id]);
    toast.success("Congratulations, you just received a Super Like! 🌟");
  };

  const toastCross = (_id) => {
    setSessionInteractedUsers((prevUsers) => [...prevUsers, _id]);
    toast.success(
      "Not a match this time, but plenty more connections await! 🚫"
    );
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <Fragment>
      <HeaderFour />
      <div className="member member--style2 padding-top padding-bottom">
        <div className="container">
          <div className="section__wrapper member-wrapp">
            <div className="member__info mb-4">
              <div className="member__info--left">
                <SearchFilterModal
                  showModal={filterModal}
                  hideModal={() => {
                    setFilterModal(false);
                  }}
                />
                <div className="member__info--filter">
                  <div className="default-btn">
                    <span onClick={() => setFilterModal(true)}>
                      Filter Your Search <i className="fa-solid fa-sliders"></i>
                    </span>
                  </div>
                </div>
                <div className="group__bottom--head">
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
                        value={searchInputQuery}
                        onChange={(e) => setSearchInputQuery(e.target.value)}
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

              <div className="member__info--right">
                <div className="member__info--customselect right w-100">
                  <div className="default-btn">
                    <span>Order By:</span>
                  </div>
                  <div className="banner__inputlist">
                    <SelectProduct select={"Newest"} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-0 justify-content-center mx-12-none cstm-user-wrapp">
              {loading ? (
                <>
                  <div className="loader"></div>
                </>
              ) : (
                membersbygennder.map((val, i) => (
                  <div className="member__item" key={i}>
                    <div className="member__inner member__inner-sized-hover">
                      <div
                        className="member__thumb"
                        style={{ width: "160px", height: "160px" }}
                      >
                        {val?.mainAvatar ? (
                          <img
                            src={`${BASE_URL}/assets/images/${val?.mainAvatar}`}
                            alt={`${val.imgAlt}`}
                            style={{
                              width: "160px",
                              height: "160px",
                            }}
                          />
                        ) : (
                          <img
                            src={
                              "https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                            }
                            alt={`${val.imgAlt}`}
                          />
                        )}
                      </div>
                      <div className="member__content">
                        <Link to={`/dating/user-profile?userID=1`}>
                          <h5>{val.name || "name"}</h5>
                        </Link>
                        <div>
                          <p>
                            <span>{val.occupation || "profession"}</span> ||{" "}
                            <span>{calculateAge(val.dob) || "18"}</span>
                          </p>
                          <div>
                            <p>
                              <i
                                className="fa fa-map-marker"
                                style={{ color: "#f24570" }}
                                aria-hidden="true"
                              ></i>{" "}
                              {val.address || "address"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="member__btns text-center">
                        <button
                          className="icon_border_red"
                          onClick={() => toastLove(val._id)}
                        >
                          <i
                            className="fa fa-heart icon_text_red"
                            aria-hidden="true"
                          ></i>
                        </button>

                        <button
                          className="icon_border_yellow"
                          onClick={() => toastStar(val._id)}
                        >
                          <i
                            className="fa fa-star icon_text_yellow"
                            aria-hidden="true"
                          ></i>
                        </button>

                        <button
                          className="icon_border_blue"
                          onClick={() => toastCross(val._id)}
                        >
                          <i
                            className="fa fa-times icon_text_blue"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterFour />
    </Fragment>
  );
};

export default MembersPage;
