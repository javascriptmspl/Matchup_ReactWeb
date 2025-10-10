import React, { useState, useEffect } from "react";
import HeaderFour from "../../component/layout/HeaderFour";
import PageHeader from "../component/layout/pageheader";
import GoogleMap from "../component/section/googlemap";
import FooterFour from "../../component/layout/footerFour";
import NotificationPage from "../component/popUps/notification";
import img1 from "../../assets/images/contact/icon/01.png";
import img2 from "../../assets/images/contact/icon/02.png";
import img3 from "../../assets/images/contact/icon/03.png";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { Formik, useFormik } from "formik";
const infotitle = "Contact Info";
const infosubtitle =
  "Let us know your opinions. Also, you can write to us if you have any questions.";
const contacttitle = "Feedback";
const contactdesc ="Let us know your opinions. Also, you can write to us if you have any questions..";

const infoListContent = [
  {
    imgUrl: img1,
    imgAlt: "Contact Info Thumb",
    title: "Office Address",
    desc: " Rochester, New York, United States ,14620",
  },
  {
    imgUrl: img2,
    imgAlt: "Contact Info Thumb",
    title: "Phone number",
    desc: "(+1) 455-4345455",
  },
  {
    imgUrl: img3,
    imgAlt: "Contact Info Thumb",
    title: "Send Email",
    desc: "hi@jacktexas.yahooo",
  },
];

const ContactUs = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  // const [contactState, setContactState] = useState({
  //   contactName: "",
  //   contactEmail: "",
  //   contactSubject: "",
  //   contactNumber: "",
  //   respondMassage: "",
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setContactState((prevState) => ({ ...prevState, [name]: value }));
  // };
  // const handleSubmit =(e)=>{
  //   e.preventDefault()

  //   toast.success('Message sent Successfully');

  // }
  // formik
  // const validationSchema = Yup.object({
  //   contactName: Yup.string().required("Name is required"),
  //   contactEmail: Yup.string().email("Invalid email address").required("Email is required"),
  //   contactNumber: Yup.string().required("Mobile number is required"),
  //   contactSubject: Yup.string().required("Subject is required"),
  // });

  const validationSchema = Yup.object({
    contactName: Yup.string().required("Name is required"),
    contactEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required("Mobile number is required"),
    contactSubject: Yup.string().required("Subject is required"),
  });

  const initialValues = {
    contactName: "",
    contactEmail: "",
    contactSubject: "",
    contactNumber: "",
    respondMassage: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: (values, { resetForm }) => {
      toast.success("Message sent Successfully");
      resetForm();
    },
  });
  return (
    <>
      <HeaderFour />
      {/* <PageHeader
      title={'CONTACT US'} curPage={'CONTACT'}
      /> */}
      <div className="info-section padding-top padding-bottom">
        <div className="container">
          <div className="section__header style-2 text-center">
            <h2>{infotitle}</h2>
            <p>{infosubtitle}</p>
          </div>
          <div className="section-wrapper">
            <div className="row justify-content-center g-4">
              {infoListContent.map((val, i) => (
                <div className="col-lg-4 col-sm-6 col-12" key={i}>
                  <div className="contact-item text-center">
                    <div className="contact-thumb mb-4">
                      <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                    </div>
                    <div className="contact-content">
                      <h6 className="title">{val.title}</h6>
                      <p>{val.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="contact-section bg-white">
        <div className="contact-top padding-top padding-bottom">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-9">
                <div className="contact-form-wrapper text-center">
                  <h2>{contacttitle}</h2>
                  <p className="mb-5">{contactdesc}</p>
                  <form
                    className="contact-form"
                    action="#"
                    onSubmit={formik.handleSubmit}
                  >
                    <div className="form-group">
                      <input
                        type="text"
                        name="contactName"
                        id="contactName"
                        value={formik.values.contactName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Your Name *"
                      />
                      {formik.touched.contactName &&
                      formik.errors.contactName ? (
                        <div
                          className="error"
                          style={{ color: "red", padding: "2px" }}
                        >
                          {formik.errors.contactName}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="contactEmail"
                        id="contactEmail"
                        value={formik.values.contactEmail}
                        onChange={formik.handleChange}
                        placeholder="Your Email *"
                      />
                      {formik.touched.contactEmail &&
                      formik.errors.contactEmail ? (
                        <div
                          className="error"
                          style={{ color: "red", padding: "2px" }}
                        >
                          {formik.errors.contactEmail}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                    <input
  type="text"
  name="contactNumber"
  id="contactNumber"
  value={formik.values.contactNumber}
  onChange={formik.handleChange}
  onKeyPress={(e) => {
    // Allow only numeric characters
    const isValidInput = /^\d+$/.test(e.key);
    if (!isValidInput) {
      e.preventDefault();
    }
  }}
  placeholder="Mobile Number *"
/>

                      {formik.touched.contactNumber &&
                      formik.errors.contactNumber ? (
                        <div
                          className="error"
                          style={{ color: "red", padding: "2px" }}
                        >
                          {formik.errors.contactNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="contactSubject"
                        id="contactSubject"
                        value={formik.values.contactSubject}
                        onChange={formik.handleChange}
                        placeholder="Your Subject *"
                      />
                      {formik.touched.contactSubject &&
                      formik.errors.contactSubject ? (
                        <div
                          className="error"
                          style={{ color: "red", padding: "2px" }}
                        >
                          {formik.errors.contactSubject}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group w-100">
                      <textarea
                        rows="8"
                        type="text"
                        id="respondMassage"
                        name="respondMassage"
                        value={formik.values.respondMassage}
                        onChange={formik.handleChange}
                        placeholder="Your Message"
                      ></textarea>
                    </div>
                    <div className="form-group w-100 text-center">
                      <button className="default-btn reverse" type="submit">
                        <span>Send our Message</span>
                      </button>
                    </div>
                  </form>
                  <p className="form-message"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-bottom">
          <div className="contac-bottom">
            <div className="row justify-content-center g-0">
              <div className="col-12">
                <div className="location-map">
                  <GoogleMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showNotifications && <NotificationPage />}
      <FooterFour />
    </>
  );
};

export default ContactUs;
