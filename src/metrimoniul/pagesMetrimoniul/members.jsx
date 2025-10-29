import { Link, useNavigate, useLocation } from "react-router-dom";
import SelectProduct from "../component/select/selectproduct";
import { useEffect, useState } from "react";
import userMale from "../../dating/assets/images/myCollection/user-male.jpg";

import { useDispatch } from "react-redux";
import HeaderFour from "../component/layout/HeaderFour";
import MetriSearchFilterModal from "../component/popUps/FilterUsers";
import toast from "react-hot-toast";
import Lodder from "../component/layout/Lodder";
import like from "../assets/images/icons/like.png";
import superlike from "../assets/images/icons/superlike.png";
import cancel from "../assets/images/icons/cancel.png";
import astro from "../assets/images/icons/Astro.png";
import FooterFour from "../component/layout/footerFour";
import {
  createActivity,
  getFilteredUsers,
} from "../../service/common-service/getuserbyGender";
import { BASE_URL } from "../../base";
import { fetchPotentialUsers } from "../../service/common-service/find-patner";
import { log } from "handlebars";
import { SearchFindPartnerAPI } from "../../service/MANAGE_API/find-user-API";

const MembersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredMembers = location.state?.data;

  const [members, setMembers] = useState(filteredMembers || []);
  const [filterModal, setFilterModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const datingId = localStorage.getItem("userData");
  const user_Data = datingId ? JSON.parse(datingId) : null;
  
  const userId = user_Data?.data?._id;
  const modeId = user_Data?.data?.mode;

  const handleAstroClick = () => navigate("/metrimonial/astro");

  const buttonEvent = async (id, reaction) => {
    try {
      const res = await dispatch(
        createActivity({
          senderUserId: userId,
          receiverUserId: id,
          action_logs: `User ${userId} ${reaction} User ${id}`,
          description: `${reaction} Action`,
          note: "",
          mode: modeId,
          activityType: reaction,
          page_number: 1,
          page_size: 10,
        })
      ).unwrap();
      if (res) {
        const res2 = await dispatch(
          fetchPotentialUsers({ userId, modeId })
        ).unwrap();
        setMembers(res2?.data);
      }
      toast.success(`${reaction} action performed successfully`);
    } catch (err) {
      console.error("Activity error:", err);
      toast.error("Failed to perform action");
    }
  };

  useEffect(() => {
    const myfun = async () => {
      try {
        const response = await dispatch(
          fetchPotentialUsers({ userId, modeId })
        ).unwrap();
        setLoading(false);
        setMembers(response?.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    myfun();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const query = (filter || "").trim();
      if (!query) {
        const res = await dispatch(
          fetchPotentialUsers({ userId, modeId })
        ).unwrap();
        setMembers(res?.data);
        return;
      }
      const result = await SearchFindPartnerAPI(query);
      const list = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];
      setMembers(list || []);
    } catch (err) {
      console.error("Search failed", err);
      setMembers([]);
    }
  };

  const handleFilterSearch = async (filters) => {

    try {
      const response = await dispatch(
        getFilteredUsers({
          ...filters,
          userId,
          modeId,
          location: filters.address, 
        })
      ).unwrap();

      if (response?.data && response.data.length > 0) {
        setMembers(response.data);
      } else {
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
      {loading ? (
        <Lodder />
      ) : (
        <div className="member member--style3 padding-top padding-bottom">
          <div className="container">
            {/* Filter UI */}
            <div className="member__info mb-4">
              <div className="member__info--left">
                <div className="member__info--filter">
                  <div
                    className="default-btn"
                    style={{ backgroundColor: "#f24570" }}
                  >
                    <span onClick={() => setFilterModal(true)}>
                      Filter Your Search <i className="fa-solid fa-sliders"></i>
                    </span>
                  </div>
                </div>
                <div className="group__bottom--head">
                  <div className="left">
                    <form onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        name="name"
                        placeholder="search..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      />
                      <button type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="member__info--right">
                <div className="member__info--customselect right w-100">
                  <div
                    className="default-btn text"
                    style={{ backgroundColor: "#f24570", color: "white" }}
                  >
                    <span className="text-light">Order By:</span>
                  </div>
                  <div className="banner__inputlist">
                    <SelectProduct select={"Newest"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="section__wrapper">
              <div className="row g-0 mx-12-none justify-content-center">
                {members?.map((val, i) => (
                  <div className="member__item" key={i}>
                    <div className="member__inner">
                      <div className="member__thumb member-atsro-main">
                        {(() => {
                          const mainShown = val.mainAvatar || val.avatars[0];
                          const mainSrc = mainShown
                            ? `${BASE_URL}/assets/images/${mainShown}`
                            : userMale;
                          const thumbnails = Array.isArray(val.avatars)
                            ? val.avatars
                                .filter((a) => a && a !== mainShown)
                                .slice(0, 4)
                            : [];
                          return (
                            <>
                              <img src={mainSrc} alt="dating thumb" />
                              {thumbnails.length > 0 && (
                                <div
                                  className="member__thumb-grid"
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: 6,
                                    marginTop: 8,
                                  }}
                                >
                                  {thumbnails.map((a, idx) => (
                                    <img
                                      key={idx}
                                      src={`${BASE_URL}/assets/images/${a}`}
                                      alt="user gallery"
                                      style={{
                                        width: "100%",
                                        height: 48,
                                        objectFit: "cover",
                                        borderRadius: 4,
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <div
                        className="member-atsro"
                        onClick={handleAstroClick}
                        style={{ cursor: "pointer" }}
                      >
                        <img src={astro} alt="" className="member-atsro-imgs" />
                        <small className="text-light float-end pe-2 pt-1">
                          Astro
                        </small>
                      </div>
                      <div className="member__content">
                        <Link to={`/metrimonial/user-profile/${val._id}`}>
                          <h5>{val.name || ""}</h5>
                        </Link>
                        <p>
                          <small style={{ color: "#f24570" }}>
                            <i className="me-2 fa fa-graduation-cap"></i>
                          </small>
                          <small>{val.occupation || ""}</small>
                        </p>
                        <p>
                          <small style={{ color: "#f24570" }}>
                            <i className="me-2 fa fa-map-marker"></i>
                          </small>
                          <small>{val.dob || ""}</small> ||{" "}
                          <small>{`${val.Height}ft` || ""}</small>
                        </p>
                        <div className="row col-12">
                          <div className="col-4 mx-auto">
                            <img
                              src={cancel}
                              alt=""
                              className="pointer"
                              title="Cancel"
                              onClick={() => buttonEvent(val?._id, "dislike")}
                              // onClick={() => handleCancel(val._id)}
                            />
                          </div>
                          <div className="col-4 mx-auto">
                            <img
                              src={superlike}
                              alt=""
                              className="pointer"
                              title="SuperLike"
                              onClick={() => buttonEvent(val?._id, "superlike")}
                            />
                          </div>
                          <div className="col-4 mx-auto">
                            <img
                              src={like}
                              alt=""
                              className="pointer"
                              title="Like"
                              onClick={() => buttonEvent(val?._id, "like")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <MetriSearchFilterModal
                showModal={filterModal}
                hideModal={() => setFilterModal(false)}
                onSubmit={handleFilterSearch}
              />
            </div>
          </div>
          <FooterFour />
        </div>
      )}
    </>
  );
};

export default MembersPage;
