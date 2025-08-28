import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateInterestsAsync } from "../../dating/store/slice/profileSlice"; // ✅ same as dating
import { fetchInterests } from "../../service/common-service/getuserbyGender"; // ✅ same as dating

const SelectInterest = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interests, setInterests] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ localStorage se userId lena (same as dating)
  const user = localStorage.getItem("userData");
  const userObj = user ? JSON.parse(user) : null;
  const userId = userObj?.data?._id;

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const res = await dispatch(
          fetchInterests({
            token: "68ad621a1130f0d24d4aff06", // same token
            page_no: 1,
            page_size: 1000,
          })
        );
        const data = res.payload.data;
        setInterests(data);
      } catch (err) {
        toast.error("Failed to load interests");
      }
    };
    loadInterests();
  }, [dispatch]);

  // ✅ object based selection (same as dating)
  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((item) => item !== interest));
    } else {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  // ✅ submit function (same as dating)
  const handleNavigateHome = async () => {
    try {
      await toast.promise(
        dispatch(updateInterestsAsync({ userId, interests: selectedInterests })),
        {
          loading: "Saving your interests 😍...",
          success: <b>Settings saved! Redirecting...</b>,
          error: <b>Could not save. Please try again.</b>,
        }
      );
      navigate("/metrimonial/add-photos"); // ✅ matrimonial route
    } catch (error) {
      toast.error("Error submitting interests. Please try again.");
    }
  };

  return (
    <div className="container padding-top padding-bottom">
      <div className="row text-center">
        <h2 className="mb-4">Select Your Interests</h2>
        <div className="col">
          {interests.map((interest, index) => (
            <Link
              key={index}
              style={{
                border: `1px solid ${
                  selectedInterests.includes(interest) ? "#d63384" : "lightgray"
                }`,
                margin: "10px 10px 10px 10px",
                padding: "5px 12px",
                borderRadius: "25px",
                cursor: "pointer",
              }}
              className={`interest-item flex-nowrap ${
                selectedInterests.includes(interest) ? "selected" : ""
              }`}
              onClick={() => handleInterestToggle(interest)}
            >
              {interest.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="col-4 mt-4">
        {selectedInterests.length > 0 ? (
          <button className="default-btn reverse" onClick={handleNavigateHome}>
            <span>Submit your interests</span>
          </button>
        ) : (
          <button
            className="default-btn reverse"
            onClick={() => navigate("/metrimonial/add-photos")}
          >
            <span>Skip</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectInterest;
