
import moment from "moment";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserProfileAsync } from "../../store/slice/profileSlice";
const ManageProfileBasicInput = ({ userData, onUpdateProfile }) => {
  const dispatch = useDispatch();
  const userDatas = localStorage.getItem("userData");
  const userDataObj = userDatas ? JSON.parse(userDatas) : null;
  const userId = userDataObj?.data?._id || null;

  const [userDataEdit, setUserDataEdit] = useState({
    name: userData?.name || "",
    dob: userData?.dob ? moment(userData?.dob).format("YYYY-MM-DD") : "",
    iAm: userData?.iAm || "",
    looking: userData?.looking || "",
    marital: userData?.marital || "",
    address: userData?.address || "",
  });

  useEffect(() => {
    if (userData) {
      setUserDataEdit({
        name: userData?.name || "",
        dob: userData?.dob ? moment(userData?.dob).format("YYYY-MM-DD") : "",
        iAm: userData?.iAm || "",
        looking: userData?.looking || "",
        marital: userData?.marital || "",
        address: userData?.address || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not found!");
      return;
    }

    if (
      !userDataEdit.name ||
      !userDataEdit.dob ||
      !userDataEdit.iAm ||
      !userDataEdit.looking ||
      !userDataEdit.marital ||
      !userDataEdit.address
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const updatedUserData = {
        ...userDataEdit,
        dob: userDataEdit.dob
          ? new Date(userDataEdit.dob).toISOString()
          : userDataEdit.dob,
      };

   

      await dispatch(updateUserProfileAsync({ updatedUserData, userId }));

      onUpdateProfile();
      toast.success("Basic info successfully updated ✅");
    } catch (error) {
      console.error("Error updating user profile:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(
        `Failed to update basic info ❌: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <section className="log-reg log-reg-manage-profile">
      <div className="container">
        <div className="row manage-profile-input-bg">
          <div className="col-lg-12 ps-lg-5">
            <div className="log-reg-inner input-height-basic">
              <div className="main-content">
                <form onSubmit={handleSubmit}>
                  <h4 className="content-title manage-profile-input-top-title">
                    Basic info
                  </h4>

                  <div className="form-group">
                    <label>Name*</label>
                    <input
                      type="text"
                      name="name"
                      className="my-form-control"
                      placeholder="Enter Your Full Name"
                      value={userDataEdit.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Birthday*</label>
                    <input
                      type="date"
                      name="dob"
                      value={userDataEdit.dob}
                      onChange={handleChange}
                      className="my-form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>I am a*</label>
                    <div className="banner__inputlist">
                      <div className="s-input me-3">
                        <input
                          type="radio"
                          name="iAm"
                          id="iAmMale"
                          value="Male"
                          checked={userDataEdit.iAm === "Male"}
                          onChange={handleChange}
                        />
                        <label htmlFor="iAmMale">Man</label>
                      </div>
                      <div className="s-input">
                        <input
                          type="radio"
                          name="iAm"
                          id="iAmFemale"
                          value="Female"
                          checked={userDataEdit.iAm === "Female"}
                          onChange={handleChange}
                        />
                        <label htmlFor="iAmFemale">Woman</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Looking for a*</label>
                    <div className="banner__inputlist">
                      <div className="s-input me-3">
                        <input
                          type="radio"
                          name="looking"
                          id="lookingForMan"
                          value="Male"
                          checked={userDataEdit.looking === "Male"}
                          onChange={handleChange}
                        />
                        <label htmlFor="lookingForMan">Man</label>
                      </div>
                      <div className="s-input">
                        <input
                          type="radio"
                          name="looking"
                          id="lookingForWoman"
                          value="Female"
                          checked={userDataEdit.looking === "Female"}
                          onChange={handleChange}
                        />
                        <label htmlFor="lookingForWoman">Woman</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Marital status*</label>
                    <div className="banner__inputlist">
                      <div className="s-input me-3">
                        <input
                          className="pointer"
                          type="radio"
                          name="marital"
                          id="Single"
                          value="Single"
                          checked={userDataEdit.marital === "Single"}
                          onChange={handleChange}
                        />
                        <label className="pointer" htmlFor="Single">
                          Single
                        </label>
                      </div>
                      <div className="s-input me-3">
                        <input
                          className="pointer"
                          type="radio"
                          name="marital"
                          id="married"
                          value="Married"
                          checked={userDataEdit.marital === "Married"}
                          onChange={handleChange}
                        />
                        <label className="pointer" htmlFor="married">
                          Married
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address*</label>
                    <input
                      type="text"
                      className="my-form-control"
                      placeholder="Enter Your City"
                      name="address"
                      id="address"
                      value={userDataEdit.address}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="default-btn reverse">
                    <span>Update profile</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ManageProfileBasicInput;