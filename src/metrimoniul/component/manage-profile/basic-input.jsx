import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserProfileAsync } from "../../../dating/store/slice/profileSlice";
import { USER_ID_LOGGEDIN } from "../../../utils";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from "moment";

const ManageProfileBasicInput = ({ userData, onUpdateProfile }) => {
  const dispatch = useDispatch();
  const userId = USER_ID_LOGGEDIN;

  const validationSchema = Yup.object({ 
    // name: Yup.string().required('Name is required'),
    // dob: Yup.date().required('Birthday is required'),
    // iAm: Yup.string().required('Please select your gender'),
    // looking: Yup.string().required('Please select the gender you are looking for'),
    // marital: Yup.string().required('Marital status is required'),
    // address: Yup.string().required('Address is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: userData?.name || '',
      dob: moment(userData?.dob).format("YYYY-MM-DD") || '' ,
      iAm: userData?.iAm || '' ,
      looking: userData?.looking || '' ,
      marital: userData?.marital || '' ,
      address: userData?.address || '' ,
    },
    validationSchema,

    onSubmit: async (values) => {
      try {
        const updatedUserData = values;
        
        const promise = new Promise((resolve) => setTimeout(resolve, 1000));

        await toast.promise(
          promise,
          {
            loading: 'Updating...',
            success: 'Basic info successfully updated',
            error: 'Failed to update basic info',
          }
        );
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
            <div className="log-reg-inner  input-height-basic">
              <div className="main-content">
                <form onSubmit={formik.handleSubmit}>
                  <h4 className="content-title manage-profile-input-top-title">
                    Basic info
                  </h4>
                  <div className="form-group">
                    <label>Name*</label>
                    <input
                      type="text"
                      name="name"
                      className={`my-form-control ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
                      placeholder="Enter Your Full Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="error-message">{formik.errors.name}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <label>Birthday*</label>
                    <input
                      type="date"
                      name="dob"
                      value={formik.values.dob}
                      onChange={formik.handleChange}
                      className={`my-form-control ${formik.touched.dob && formik.errors.dob ? 'error' : ''}`}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.dob && formik.errors.dob ? (
                      <div className="error-message">{formik.errors.dob}</div>
                    ) : null}
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
                          checked={formik.values.iAm === "Male"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label htmlFor="iAmMale">Man</label>
                      </div>
                      <div className="s-input">
                        <input
                          type="radio"
                          name="iAm"
                          id="iAmFemale"
                          value="Female"
                          checked={formik.values.iAm === "Female"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label htmlFor="iAmFemale">Woman</label>
                      </div>
                    </div>
                    {formik.touched.iAm && formik.errors.iAm ? (
                      <div className="error-message">{formik.errors.iAm}</div>
                    ) : null}
                  </div>
                 
                  <div className="form-group">
                    <label>Marital Status*</label>
                    <select
                      name="marital"
                      value={formik.values.marital}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`my-form-control ${formik.touched.marital && formik.errors.marital ? 'error' : ''}`}
                    >
                      <option value="" label="Select Marital Status" />
                      <option value="NeverMarried" label="Never Married" />
                      <option value="AwaitingDivorce" label="Awaiting Divorce" />
                      <option value="Divorce" label="Divorce" />
                      <option value="Widowed" label="Widowed" />
                    </select>
                    {formik.touched.marital && formik.errors.marital ? (
                      <div className="error-message">{formik.errors.marital}</div>
                    ) : null}
                  </div>
                
                  <button
                    type="submit"
                    className="default-btn reverse"
                    // disabled={formik.isSubmitting}
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

export default ManageProfileBasicInput;
