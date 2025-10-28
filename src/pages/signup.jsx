import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../assets/images/logoMatchup.png";
import { useDispatch, useSelector } from "react-redux";
import { createUserAsync } from "../dating/store/slice/AuthSlice";
import toast, { Toaster } from "react-hot-toast";
import WhoseProfileModal from "../metrimoniul/component/popUps/WhoseProfileModal";
import { MODE_DATING, MODE_METRI } from "../utils";

const title = "Welcome to Matchup";
const desc =
  "Let's create your profile! Just fill in the fields below, and we’ll get a new account.";
const accTitle = "Account Details";

const SignUp = (selectedProfile) => {
  const [SelectProfile, setSelectProfile] = useState(false);
  const [showModeFeilds, setShowModeFeilds] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedForWhome, setSelectedForWhome] = useState("");
  const [modeChange, setModeChange] = useState("dating");

  const navigate = useNavigate();

  useEffect(() => {
    const storedMode = localStorage.getItem("signFor");

    if (storedMode) {
      setShowModeFeilds(JSON.parse(storedMode));
    }
  }, []);

  const selectMetri = () => {
    setSelectProfile(true);
    setModeChange("matrimonial");
  };

  const forWhomeProfile = (selectedProfile) => {
    setSelectedForWhome(selectedProfile);
  };

  const handleSignUp = async () => {
    try {
      if (formik.isValid) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      userName: "",
      mode: MODE_DATING,
      email: "",
      password: "",
      confirmPassword: "",

      dob: "",
      iAm: "",
      looking: "",
      marital: "Single",
      city: "",

      createdProfileFor: selectedForWhome,
      gender: "",
      lookingFor: "",
      DietPreferences: "",
      Height: "",
      motherTongue: "",
      Religion: "",
      Caste: "",
      casteNoBar: "",
      horoscopes: "",
      manglikStatus: false,
      education: "",
      workingExperience: "",
      occupation: "",
      salary: "",
    },
    validationSchema: Yup.object().shape({
      mode: Yup.string().required("Please select a mode"),
      name: Yup.string().required("Please enter your full name"),
      userName: Yup.string().required("Please enter your username"),
      dob: Yup.date()
        .required("Please enter your birthday")
        .max(
          new Date().getFullYear() - 12,
          "You must be at least 12 years old"
        ),
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      const action = await createUserAsync(values);
      const { isSuccess, message, error } = action;
      if (isSuccess && modeChange === "dating") {
        navigate("/dating/interest");
        toast.success(`Account created successfully: ${message}`);
      } else if (isSuccess && modeChange === "matrimonial") {
        navigate("/metrimonial/family-details");
        toast.success(`Account created successfully: ${message}`);
      } else {
        toast.success(`Account created successfully: ${message}`);
        navigate("/dating/interest");
      }
    },
  });

  const handleToggleFormSection = () => {
    if (step === 1) {
      if (
        formik.values.mode &&
        formik.values.name &&
        formik.values.userName &&
        formik.values.email &&
        formik.values.password &&
        formik.values.confirmPassword
      ) {
        console.log(
          "After storing in local storage:",
          localStorage.getItem("signFor")
        );

        setStep((prevStep) => prevStep + 1);
      } else {
        console.log("fill requiered fields");
      }
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const removeMode = () => {
    localStorage.removeItem("signFor");
  };

  return (
    <section className="log-reg">
      <div className="top-menu-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-7">
              <div className="logo">
                <Link to="/">
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      width: "100px",
                      Height: "40px",
                    }}
                  />
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-5">
              <Link to="/" className="backto-home" onClick={removeMode}>
                <i className="fas fa-chevron-left"></i> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="image"></div>
          <div className="col-lg-7">
            <div className="log-reg-inner">
              <div className="section-header">
                <h2 className="title">{title} </h2>
                <p>{desc} </p>
              </div>
              <div className="main-content">
                <form onSubmit={formik.handleSubmit}>
                  {step === 1 && (
                    <div className="custom-show-cls">
                      <h4 className="content-title">{accTitle}</h4>
                      {/* mode  */}
                      <div className="form-group">
                        <label>
                          Mode<span>*</span>
                        </label>
                        <div className="banner__inputlist ">
                          <div className="s-input me-3 ">
                            <input
                              className="pointer"
                              type="radio"
                              name="mode"
                              id="mode"
                              value={MODE_DATING}
                              checked={formik.values.mode === MODE_DATING}
                              onChange={formik.handleChange}
                              onClick={() => setModeChange("dating")}
                            />
                            <label className="pointer" htmlFor="dating">
                              Dating
                            </label>
                          </div>
                          <div className="s-input">
                            <input
                              className="pointer"
                              type="radio"
                              name="mode"
                              id="mode"
                              value={MODE_METRI}
                              checked={formik.values.mode === MODE_METRI}
                              onClick={selectMetri}
                              onChange={formik.handleChange}
                            />
                            <label className="pointer" htmlFor="matrimonial">
                              Matrimonial
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* name  */}

                      <div className="form-group">
                        <label>
                          Name<span>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Your Full Name"
                          className="my-form-control"
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.name}
                          </div>
                        ) : null}
                      </div>

                      {/* userName  */}
                      <div className="form-group">
                        <label>
                          Username<span>*</span>
                        </label>
                        <input
                          type="text"
                          name="userName"
                          value={formik.values.userName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Your Username"
                          className="my-form-control"
                        />
                        {formik.touched.userName && formik.errors.userName ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.userName}
                          </div>
                        ) : null}
                      </div>

                      {/* birthday  */}

                      <div className="form-group">
                        <label>
                          Birthday<span>*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formik.values.dob}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="my-form-control"
                        />
                        {formik.touched.dob && formik.errors.dob ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.dob}
                          </div>
                        ) : null}
                      </div>

                      {/* email  */}

                      <div className="form-group">
                        <label>
                          Email Address<span>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="item02"
                          // value={regEmail}
                          // onChange={(e) => setRegEmail(e.target.value)}
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Your Email *"
                          className="my-form-control"
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.email}
                          </div>
                        ) : null}
                      </div>

                      {/* password  */}

                      <div className="form-group">
                        <label>Password
                            <span>*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="item03"
                          // value={regPassword}
                          // onChange={(e) => setRegPassword(e.target.value)}
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Your Password *"
                          className="my-form-control"
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.password}
                          </div>
                        ) : null}
                      </div>

                      {/* consfirm password  */}

                      <div className="form-group">
                        <label>
                          Confirm Password<span>*</span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="item04"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Your Password *"
                          className="my-form-control"
                        />
                        {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.confirmPassword}
                          </div>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        className="default-btn reverse"
                        onClick={handleToggleFormSection}
                      >
                        <span>Next</span>
                      </button>
                    </div>
                  )}

                  {step === 2 && formik.values.mode === MODE_DATING && (
                    <div className="custom-normalhide">
                      <h4 className="content-title mt-5">
                        Profile Details
                        <button
                          type="button"
                          className="default-btn reverse"
                          onClick={() => {
                            handleToggleFormSection();
                            removeMode();
                          }}
                          style={{
                            float: "right",
                          }}
                        >
                          <span>Back</span>
                        </button>
                      </h4>

                      {/* iam  */}
                      <div className="form-group">
                        <label>I am a</label>
                        <select
                          name="iAm"
                          value={formik.values.iAm}
                          onChange={formik.handleChange}
                          className="my-form-control"
                        >
                          <option value="Male">Man</option>
                          <option value="Female">Woman</option>
                        </select>
                        {formik.touched.iAm && formik.errors.iAm ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.iAm}
                          </div>
                        ) : null}
                      </div>

                      {/* loooking for  */}
                      <div className="form-group">
                        <label>Looking for a</label>
                        <select
                          name="looking"
                          value={formik.values.looking}
                          onChange={formik.handleChange}
                          className="my-form-control"
                        >
                          <option value="Male">Man</option>
                          <option value="Female">Woman</option>
                        </select>
                        {formik.touched.looking && formik.errors.looking ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.looking}
                          </div>
                        ) : null}
                      </div>

                      {/* marital status  */}
                      <div className="form-group">
                        <label>Marital status</label>
                        <select
                          name="marital"
                          value={formik.values.marital}
                          onChange={formik.handleChange}
                          className="my-form-control"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                        </select>
                        {formik.touched.marital && formik.errors.marital ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.marital}
                          </div>
                        ) : null}
                      </div>

                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="my-form-control"
                        />
                        {formik.touched.city && formik.errors.city ? (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {formik.errors.city}
                          </div>
                        ) : null}
                      </div>
                      <button type="submit" className="default-btn reverse">
                        <span>Create your account</span>
                      </button>
                    </div>
                  )}

                  {step === 2 && formik.values.mode === MODE_METRI && (
                    <div>
                      <div className="custom-normalhide">
                        <h4 className="content-title mt-5">
                          Profile Details
                          <button
                            type="button"
                            className="default-btn reverse"
                            onClick={() => {
                              handleToggleFormSection();
                            }}
                            style={{
                              float: "right",
                            }}
                          >
                            <span>Back</span>
                          </button>
                        </h4>

                        <div className="form-group">
                          <label>Gender</label>
                          <select
                            name="gender"
                            value={formik.values.gender}
                            onChange={(e) => {
                              formik.handleChange(e);
                              // Update iAm field when gender is selected
                              formik.setFieldValue("iAm", e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Gender" disabled />
                            <option value="Male" label="Male" />
                            <option value="Female" label="Female" />
                            <option value="Other" label="Other" />
                          </select>
                          {formik.touched.gender &&
                          formik.errors.gender ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.gender}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Looking for</label>
                          <select
                            name="lookingFor"
                            value={formik.values.lookingFor}
                            onChange={(e) => {
                              formik.handleChange(e);
                              // Update looking field when looking for gender is selected
                              formik.setFieldValue("looking", e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Gender" disabled />
                            <option value="Male" label="Male" />
                            <option value="Female" label="Female" />
                          </select>
                          {formik.touched.lookingFor &&
                          formik.errors.lookingFor ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.lookingFor}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Diet</label>
                          <select
                            name="DietPreferences"
                            value={formik.values.DietPreferences}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Diet" disabled />
                            <option value="vegetarian" label="Vegetarian" />
                            <option value="vegan" label="Vegan" />
                            <option value="pescatarian" label="Pescatarian" />
                            {/* Add more DietPreferences options as needed */}
                          </select>
                          {formik.touched.DietPreferences &&
                          formik.errors.DietPreferences ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.DietPreferences}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Height</label>
                          <select
                            name="Height"
                            value={formik.values.Height}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Height" disabled />
                            <option value="5'0" label="5 feet 0 inches" />
                            <option value="5'1" label="5 feet 1 inch" />
                            {/* Add more Height options as needed */}
                            <option value="6'0" label="6 feet 0 inches" />
                          </select>
                          {formik.touched.Height && formik.errors.Height ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.Height}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Marital Status</label>
                          <select
                            name="marital"
                            value={formik.values.marital}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Marital Status" />
                            <option
                              value="NeverMarried"
                              label="Never Married"
                            />
                            <option
                              value="AwaitingDivorce"
                              label="Awaiting Divorce"
                            />
                            <option value="Divorce" label="Divorce" />
                            <option value="Widowed" label="Widowed" />
                          </select>
                          {formik.touched.motherTongue &&
                          formik.errors.motherTongue ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.motherTongue}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Languages</label>
                          <select
                            name="motherTongue"
                            value={formik.values.motherTongue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option
                              value=""
                              label="Select Languages"
                              disabled
                            />
                            <option value="english" label="English" />
                            <option value="spanish" label="Spanish" />
                            <option value="french" label="French" />
                            <option value="german" label="German" />
                            <option value="chinese" label="Chinese" />
                          </select>
                          {formik.touched.motherTongue &&
                          formik.errors.motherTongue ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.motherTongue}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Religion</label>
                          <select
                            name="Religion"
                            value={formik.values.Religion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Religion" />
                            <option value="christianity" label="Christianity" />
                            <option value="islam" label="Islam" />
                            <option value="hinduism" label="Hinduism" />
                            <option value="buddhism" label="Buddhism" />
                            <option value="judaism" label="Judaism" />
                            {/* Add more Religion options as needed */}
                          </select>
                          {formik.touched.Religion && formik.errors.Religion ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.Religion}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Caste</label>
                          <select
                            name="Caste"
                            value={formik.values.Caste}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Caste" />
                            <option value="brahmin" label="Brahmin" />
                            <option value="kshatriya" label="Kshatriya" />
                            <option value="vaishya" label="Vaishya" />
                            <option value="shudra" label="Shudra" />
                            {/* Add more Caste options as needed */}
                          </select>
                          {formik.touched.Caste && formik.errors.Caste ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.Caste}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Caste</label>
                          <div>
                            <input
                              type="checkbox"
                              name="casteNoBar"
                              checked={formik.values.casteNoBar}
                              onChange={(e) => {
                                formik.handleChange(e);
                                // Toggle the value when the checkbox is clicked
                                formik.setFieldValue(
                                  "casteNoBar",
                                  !formik.values.casteNoBar
                                );
                              }}
                              onBlur={formik.handleBlur}
                              className="float-start"
                            />
                            <span className="checkbox-label">
                              Caste no bar <br />I am open to marry people of
                              all castes
                            </span>
                          </div>
                          {formik.touched.casteNoBar &&
                          formik.errors.casteNoBar ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.casteNoBar}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Horoscope</label>
                          <select
                            name="horoscopes"
                            value={formik.values.horoscopes}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option
                              value=""
                              label="Select Horoscope"
                              disabled
                            />
                            <option value="must" label="Must" />
                            <option
                              value="notNecessary"
                              label="Not Necessary"
                            />
                            {/* Add more horoscopes options as needed */}
                          </select>

                          {formik.touched.profileDetails?.horoscopes &&
                          formik.errors.profileDetails?.horoscopes ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.horoscopes}
                            </div>
                          ) : null}

                          {formik.values.horoscopes === "must" && (
                            <div className="form-group mt-2">
                              <label>Manglik Status*</label>
                              <select
                                name="manglikStatus"
                                value={formik.values.manglikStatus.toString()}
                                onChange={(e) => {
                                  const isTrue = e.target.value === "true";
                                  formik.handleChange(e);
                                  formik.setFieldValue("manglikStatus", isTrue);
                                }}
                                onBlur={formik.handleBlur}
                                className="my-form-control"
                              >
                                <option
                                  value=""
                                  label="Select Manglik Status"
                                  disabled
                                />
                                <option value="true" label="Manglik" />
                                <option value="false" label="Not Manglik" />
                                {/* Add more manglik status options as needed */}
                              </select>

                              {formik.touched.profileDetails?.manglikStatus &&
                              formik.errors.profileDetails?.manglikStatus ? (
                                <div
                                  className="error-message"
                                  style={{ color: "red" }}
                                >
                                  {formik.errors.manglikStatus}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Higher Education</label>
                          <select
                            name="education"
                            value={formik.values.education}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option
                              value=""
                              label="Select Higher Education"
                              disabled
                            />
                            <option
                              value="bachelors"
                              label="Bachelor's Degree"
                            />
                            <option value="masters" label="Master's Degree" />
                            <option
                              value="doctorate"
                              label="Doctorate (Ph.D.)"
                            />
                            <option value="other" label="Other" />
                            {/* Add more higher education options as needed */}
                          </select>
                          {formik.touched.education &&
                          formik.errors.education ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.education}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Work Experience</label>
                          <select
                            name="workingExperience"
                            value={formik.values.workingExperience}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option
                              value=""
                              label="Select Work Experience"
                              disabled
                            />
                            <option
                              value="lessThan1Year"
                              label="Less than 1 year"
                            />
                            <option value="1To3Years" label="1 to 3 years" />
                            <option value="3To5Years" label="3 to 5 years" />
                            <option value="5To10Years" label="5 to 10 years" />
                            <option
                              value="moreThan10Years"
                              label="More than 10 years"
                            />
                            {/* Add more work experience options as needed */}
                          </select>
                          {formik.touched.workingExperience &&
                          formik.errors.workingExperience ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.workingExperience}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Occupation</label>
                          <select
                            name="occupation"
                            value={formik.values.occupation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option
                              value=""
                              label="Select Occupation"
                              disabled
                            />
                            <option value="engineer" label="Engineer" />
                            <option value="teacher" label="Teacher" />
                            <option value="doctor" label="Doctor" />
                            <option value="lawyer" label="Lawyer" />
                            <option value="entrepreneur" label="Entrepreneur" />
                            {/* Add more occupation options as needed */}
                          </select>
                          {formik.touched.occupation &&
                          formik.errors.occupation ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.occupation}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>Income</label>
                          <select
                            name="salary"
                            value={formik.values.salary}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="my-form-control"
                          >
                            <option value="" label="Select Income" disabled />
                            <option value="below20k" label="Below $20,000" />
                            <option
                              value="20kto40k"
                              label="$20,000 - $40,000"
                            />
                            <option
                              value="40kto60k"
                              label="$40,000 - $60,000"
                            />
                            <option
                              value="60kto80k"
                              label="$60,000 - $80,000"
                            />
                            <option value="above80k" label="Above $80,000" />
                            {/* Add more salary options as needed */}
                          </select>
                          {formik.touched.salary && formik.errors.salary ? (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {formik.errors.salary}
                            </div>
                          ) : null}
                        </div>

                        <button type="submit" className="default-btn reverse">
                          <span>Create your account</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
      <WhoseProfileModal
        showModal={SelectProfile}
        hideModal={() => setSelectProfile(false)}
        onSelectProfile={forWhomeProfile}
      />
    </section>
  );
};

export default SignUp;
