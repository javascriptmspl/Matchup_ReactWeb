import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserProfileAsync } from "../../../dating/store/slice/profileSlice";
import { USER_ID_LOGGEDIN } from "../../../utils";
import { useFormik } from "formik";
import * as Yup from "yup";

const PersonalDetalsInput = ({ userData, onUpdateProfile }) => {
  const dispatch = useDispatch();
  const userId = USER_ID_LOGGEDIN;
  const validationSchema = Yup.object({
    Religion: Yup.string().required("Religion is required"),
    Caste: Yup.string().required("Caste is required"),
    address: Yup.string().required("Address is required"),
    Height: Yup.string().required("Height is required"),
    DietPreferences: Yup.string().required("Diet is required"),
  });

  const formik = useFormik({
    initialValues: {
      Religion: userData?.Religion || "",
      Caste: userData?.Caste || "",
      address: userData?.address || "",
      Height: userData?.Height || "",
      DietPreferences: userData?.DietPreferences || "",
    },

    validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedUserData = values;

        const promise = new Promise((resolve) => setTimeout(resolve, 1000));

        await toast.promise(promise, {
          loading: "Updating...",
          success: "Contact details successfully updated",
          error: "Failed to update contact details",
        });

        await dispatch(updateUserProfileAsync({ updatedUserData, userId }));
        onUpdateProfile();
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast.error("Failed to update basic info");
      }
    },
  });

  return (
    <section className="log-reg log-reg-manage-profile">
      <div className="container">
        <div className="row manage-profile-input-bg">
          <div className="col-lg-12 ps-lg-5">
            <div className="log-reg-inner input-height-basic">
              <div className="main-content">
                <form onSubmit={formik.handleSubmit}>
                  <h4 className="content-title manage-profile-input-top-title">
                    Personal Details
                  </h4>
                  <div className="form-group">
                    <label>Religion*</label>
                    <input
                      type="text"
                      name="Religion"
                      className={`my-form-control ${
                        formik.touched.Religion && formik.errors.Religion
                          ? "error"
                          : ""
                      }`}
                      placeholder="Enter Your Religion"
                      value={formik.values.Religion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.Religion && formik.errors.Religion ? (
                      <div className="error-message">
                        {formik.errors.Religion}
                      </div>
                    ) : null}
                  </div>

                  <div className="form-group">
                    <label>Caste*</label>
                    <input
                      type="text"
                      name="Caste"
                      className={`my-form-control ${
                        formik.touched.Caste && formik.errors.Caste
                          ? "error"
                          : ""
                      }`}
                      placeholder="Enter Your Caste"
                      value={formik.values.Caste}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.Caste && formik.errors.Caste ? (
                      <div className="error-message">{formik.errors.Caste}</div>
                    ) : null}
                  </div>

                  <div className="form-group">
                    <label>Address*</label>
                    <input 
                      type="text" 
                      name="address"
                      placeholder="Enter Your Address"
                      value={formik.values.address}
                      className={`my-form-control ${
                        formik.touched.address && formik.errors.address
                          ? "error"
                          : ""
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} 
                    />

                    {formik.touched.address && formik.errors.address ? (
                      <div className="error-message">
                        {formik.errors.address}
                      </div>
                    ) : null}
                  </div>
                  

                  <div className="form-group">
                    <label>Height*</label>
                    <input
                      type="text"
                      name="Height"
                      className={`my-form-control ${
                        formik.touched.Height && formik.errors.Height
                          ? "error"
                          : ""
                      }`}
                      placeholder="Enter Your Height"
                      value={formik.values.Height}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.Height && formik.errors.Height ? (
                      <div className="error-message">
                        {formik.errors.Height}
                      </div>
                    ) : null}
                  </div>

                  <div className="form-group">
                    <label>Diet*</label>
                    <select
                      name="DietPreferences"
                      className={`my-form-control ${
                        formik.touched.DietPreferences &&
                        formik.errors.DietPreferences
                          ? "error"
                          : ""
                      }`}
                      value={formik.values.DietPreferences}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="" label="Select Diet Preference" />
                      <option value="Vegetarian" label="Vegetarian" />
                      <option value="Non-Vegetarian" label="Non-Vegetarian" />
                      <option
                        value="Both Veg and Non-Veg"
                        label="Both Veg and Non-Veg"
                      />
                      <option value="Vegan" label="Vegan" />
                      {/* Add more diet options as needed */}
                    </select>

                    {formik.touched.DietPreferences &&
                    formik.errors.DietPreferences ? (
                      <div className="error-message">
                        {formik.errors.DietPreferences}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="default-btn reverse"
                    disabled={formik.isSubmitting}
                  >
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

export default PersonalDetalsInput;
