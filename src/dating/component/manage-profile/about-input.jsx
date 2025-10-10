import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserProfileAsync } from "../../store/slice/profileSlice";

const ManageProfileAboutInput = ({ userData, onUpdateProfile, editMode }) => {
  const [userDataEdit, setUserDataEdit] = useState({
    email: userData?.email || "",
    phone: userData?.phoneNumber || "",
    description: userData?.description || "",
  });

  const [buttonClass, setButtonClass] = useState("default-btn reverse");
  const dispatch = useDispatch();
  const userDatas = localStorage.getItem("userData");
  const userDataObj = JSON.parse(userDatas);

  // Fix: Get userId from correct path (data._id not data.data._id)
  const userId = userDataObj?.data?._id || userDataObj?._id || null;

  useEffect(() => {
    // Update userDataEdit when userData changes
    setUserDataEdit({
      email: userData?.email || "",
      phone: userData?.phoneNumber || "",
      description: userData?.description || "",
    });
  }, [userData]);
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setUserDataEdit((prevUserDataEdit) => ({
        ...prevUserDataEdit,
        [name]: value,
      }));
    } else {
      setUserDataEdit((prevUserDataEdit) => ({
        ...prevUserDataEdit,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate userId
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    // Validate description
    if (!userDataEdit.description || userDataEdit.description.trim() === "") {
      toast.error("Description cannot be empty");
      return;
    }

    try {
      const updatedUserData = {
        description: userDataEdit.description.trim()
      };
      
      console.log("Updating profile with:", { updatedUserData, userId });
      
      const result = await dispatch(updateUserProfileAsync({ updatedUserData, userId }));
      
      if (result.error) {
        throw new Error(result.error.message || "Update failed");
      }

      // Call the callback to refresh parent component
      if (onUpdateProfile) {
        onUpdateProfile();
      }
      
      toast.success("About info successfully updated");
      setButtonClass("default-btn reverse");
    } catch (error) {
      console.error("Error updating About profile:", error);
      toast.error(error.message || "Failed to update About info");
    }
  };

  return (
    <section className="log-reg log-reg-manage-profile">
      <div className="container">
        <div className="row manage-profile-input-bg">
          <div className="col-lg-12 ps-lg-5">
            <div className="log-reg-inner  input-height-basic">
              <div className="main-content">
                <>
                  <form onSubmit={handleSubmit}>
                    <h4 className="content-title manage-profile-input-top-title">
                      About-Info
                    </h4>

                    <div className="form-group">
                      <label>Description*</label>
                      <textarea
                        name="description"
                        placeholder="Enter Description"
                        value={userDataEdit.description}
                        onChange={handleChange}
                        className="my-form-control"
                        rows="4"
                        style={{ minHeight: "100px", resize: "vertical" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className={buttonClass}
                      onClick={() =>
                        setButtonClass("info basic-info-manage-ptofile")
                      }
                    >
                      <span>Update profile</span>
                    </button>
                  </form>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageProfileAboutInput;
