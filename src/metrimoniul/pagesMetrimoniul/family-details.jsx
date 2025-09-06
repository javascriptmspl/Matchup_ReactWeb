import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import HeaderFour from "../component/layout/HeaderFour";
import { metriUpdateFamilyAsync } from "../../service/common-service/familydetails";
import { useDispatch } from "react-redux";

const title = "Welcome to Matchup";
const desc =
  "Let's create your profile! Just fill in the fields below, and we’ll get a new account.";
const accTitle = "Account Details";

const FamilyDetails = (selectedProfile) => {

  const storedUser = localStorage.getItem("userData");
const userId = storedUser ? JSON.parse(storedUser)?.data?._id : null;
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const saveSettings = async (selectedProfile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  // const formik = useFormik({
  //   initialValues: {
  //     familyStatus: "",
  //     FathersName: "",
  //     FathersStatus: "",
  //     MothersName: "",
  //     MothersStatus: "",
  //     NumberOfBrother: 0,
  //     NoOfMarriedBrother: 0,
  //     NumberOfSister: 0,
  //     NoOfMarriedSister: 0,
  //     GovtIDProof: "",
  //   },
  //   onSubmit: async (values) => {
  //     try {
  //       await new Promise((resolve) => setTimeout(resolve, 100));

  //       await toast.promise(
  //         saveSettings(selectedProfile), 
  //         {
  //           loading: "Saving your family details 😍...",
  //           success: <b>Family details saved! Redirecting...</b>,
  //           error: <b>Could not save. Please try again.</b>,
  //         }
  //       );

  //       navigate("/metrimonial/partner-preference");
  //     } catch (error) {
  //       toast.error("Error submitting Family details. Please try again.");
  //     }
  //   },
  // });



  const formik = useFormik({
    initialValues: {
      familyStatus: "",
      FathersName: "",
      FathersStatus: "",
      MothersName: "",
      MothersStatus: "",
      NumberOfBrother: 0,
      NoOfMarriedBrother: 0,
      NumberOfSister: 0,
      NoOfMarriedSister: 0,
      GovtIDProof: "",
    },
    onSubmit: async (values) => {
      try {
        await toast.promise(
          dispatch(metriUpdateFamilyAsync({ userId, values })).unwrap(),
          {
            loading: "Saving your family details 😍...",
            success: <b>Family details saved! Redirecting...</b>,
            error: <b>Could not save. Please try again.</b>,
          }
        );
        navigate("/metrimonial/partner-preference");
      } catch (error) {
        toast.error("Error submitting Family details. Please try again.");
      }
    },
  });
  



  const handleFileChange = (event) => {
    formik.setFieldValue("GovtIDProof", event.currentTarget.files[0]);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const fileInputRef = useRef(null);

  return (
    <section className="log-regs">
      <HeaderFour />
      <div className="container padding-top">
        <div className="row">
          <div>
            <h2 className="text-center">
              Some details about your family will improve your profile quality
            </h2>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="image"></div>
          <div className="">
            <div className="log-reg-inner">
              <div className="main-content mt-5">
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="custom-normalhide">
                        <div className="form-group">
                          <label>Family Status*</label>
                          <select
                            name="familyStatus"
                            value={formik.values.familyStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select" disabled />
                            <option value="good" label="Good" />
                            <option value="better" label="Better" />
                            <option value="best" label="Best" />
                            {/* Add more DietPreferences options as needed */}
                          </select>
                          {formik.touched.familyStatus &&
                          formik.errors.familyStatus ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.familyStatus}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Father’s Name*</label>
                          <input
                            type="text"
                            name="FathersName"
                            value={formik.values.FathersName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                            placeholder="Enter Father's Name"
                          />
                          {formik.touched.FathersName &&
                          formik.errors.FathersName ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.FathersName}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Father's Status*</label>
                          <select
                            name="FathersStatus"
                            value={formik.values.FathersStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select" disabled />
                            <option value="good" label="Good" />
                            <option value="better" label="Better" />
                            <option value="best" label="Best" />
                          </select>
                          {formik.touched.FathersStatus &&
                          formik.errors.FathersStatus ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.FathersStatus}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Mother's Name*</label>
                          <input
                            type="text"
                            name="MothersName"
                            value={formik.values.MothersName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                            placeholder="Enter Mother's Name"
                          />
                          {formik.touched.MothersName &&
                          formik.errors.MothersName ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.MothersName}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Mother's Status*</label>
                          <select
                            name="MothersStatus"
                            value={formik.values.MothersStatus}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select" disabled />
                            <option value="good" label="Good" />
                            <option value="better" label="Better" />
                            <option value="best" label="Best" />
                          </select>
                          {formik.touched.MothersStatus &&
                          formik.errors.MothersStatus ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.MothersStatus}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="custom-normalhide">
                        <div className="form-group">
                          <label>No of Brothers*</label>
                          <select
                            name="NumberOfBrother"
                            value={formik.values.NumberOfBrother}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="0" label="0" />
                            <option value="1" label="1" />
                            <option value="2" label="2" />
                            <option value="3" label="3" />
                            <option value="4" label="4" />
                            <option value="5" label="5" />
                          </select>
                        </div>
                        <div className="form-group">
                          <label>of which married*</label>
                          <select
                            name="NoOfMarriedBrother"
                            value={formik.values.NoOfMarriedBrother}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="0" label="0" />
                            <option value="1" label="1" />
                            <option value="2" label="2" />
                            <option value="3" label="3" />
                            <option value="4" label="4" />
                            <option value="5" label="5" />
                          </select>

                          {formik.touched.NumberOfBrother &&
                          formik.errors.NumberOfBrother ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.NumberOfBrother}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>No of Sisters*</label>
                          <select
                            name="NumberOfSister"
                            value={formik.values.NumberOfSister}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="0" label="0" />
                            <option value="1" label="1" />
                            <option value="2" label="2" />
                            <option value="3" label="3" />
                            <option value="4" label="4" />
                            <option value="5" label="5" />
                          </select>
                        </div>
                        <div className="form-group">
                          <label>of which married*</label>
                          <select
                            name="NoOfMarriedSister"
                            value={formik.values.NoOfMarriedSister}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="0" label="0" />
                            <option value="1" label="1" />
                            <option value="2" label="2" />
                            <option value="3" label="3" />
                            <option value="4" label="4" />
                            <option value="5" label="5" />
                          </select>

                          {formik.touched.NumberOfSister &&
                          formik.errors.NumberOfSister ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.NumberOfSister}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Govt ID Proof*</label>
                          <input
                            type="file"
                            name="GovtIDProof"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            ref={fileInputRef}
                          />

                          <div className="doc-upload">
                            <img
                              src={
                                formik.values.GovtIDProof
                                  ? URL.createObjectURL(
                                      formik.values.GovtIDProof
                                    )
                                  : "https://akm-img-a-in.tosshub.com/sites/btmt/images/stories//June2016/aadhar_061416050825.jpg"
                              }
                              alt="Selected ID Proof"
                              style={{
                                marginTop: "10px",
                                maxWidth: "100%",
                                cursor: "pointer",
                              }}
                              onClick={handleImageClick}
                            />
                          </div>

                          {formik.touched.GovtIDProof &&
                          formik.errors.GovtIDProof ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.GovtIDProof}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <button
                      className="default-btn reverse mt-5 mx-auto w-25"
                      type="submit"
                    >
                      <span>Done</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FamilyDetails;
