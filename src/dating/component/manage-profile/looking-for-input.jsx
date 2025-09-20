import React, { useState, useEffect } from "react";
import SelectMarid from "../select/selectmarid";

const ManageProfileLookingFor = ({ userData, updateUserData, editMode }) => {
  const [iamLookingFor, setIamLookingFor] = useState(
    editMode ? userData.iAmLookingFor : ""
  );
  const [iLike, setILike] = useState(editMode ? userData.ILike : "");

  useEffect(() => {
    if (editMode) {
      setIamLookingFor(userData.iAmLookingFor || "");
      setILike(userData.ILike || "");
    } else {
      setIamLookingFor("");
      setILike("");
    }
  }, [editMode, userData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUserData = {
      ...userData,
      iAmLookingFor: iamLookingFor,
      ILike: iLike,
    };

    updateUserData(newUserData);

    setIamLookingFor("");
    setILike("");
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
                    Looking for
                  </h4>
                  <div className="form-group">
                    <label>I'm looking for*</label>
                    <input
                      type="text"
                      className="my-form-control"
                      placeholder="I'm looking for"
                      value={iamLookingFor}
                      onChange={(e) => setIamLookingFor(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Whatever I like*</label>
                    <input
                      type="text"
                      className="my-form-control"
                      placeholder="Whatever I like"
                      value={iLike}
                      onChange={(e) => setILike(e.target.value)}
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

export default ManageProfileLookingFor;
