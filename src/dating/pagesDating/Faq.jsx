import React, { useState, useEffect } from "react";
import axios from "axios";
import FooterFour from "../../component/layout/footerFour";
import HeaderFour from "../../component/layout/HeaderFour";
import { MODE_METRI } from "../../utils";
import { BASE_URL } from "../../base";
// import PageHeader from "../component/layout/pageheader";

// const modeId = Mode();

const Accordion = ({ title, content, isOpen, toggleAccordion }) => {
  const accordionItemStyle = {
    position: "relative",
    display: "block",
    borderBottom: "1px solid #ccc",
    marginBottom: "10px",
  };

  const accordionTitleStyle = {
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
    fontSize: "22px",
    color: "#333",
    padding: "30px 30px 40px 0px",
    letterSpacing: "1px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const accordionContentStyle = {
    display: isOpen ? "block" : "none",
    position: "relative",
    padding: "0 0 30px 0",
    paddingRight: "120px",
  };

  const arrowIconStyle = {
    width: "16px",
    height: "16px",
    fill: "#333",
    transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
    transition: "transform 0.3s ease-in-out",
  };

  return (
    <div style={accordionItemStyle}>
      <div style={accordionTitleStyle} onClick={toggleAccordion}>
        {title}
        <svg
          fill="#000000"
          height="50px"
          width="50px"
          style={arrowIconStyle}
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 330 330"
          xmlSpace="preserve"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              id="XMLID_224_"
              d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
            ></path>
          </g>
        </svg>
      </div>
      <div style={accordionContentStyle}>
        <p>{content}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState(-1);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/faq/getall/${MODE_METRI}`
        );
        setFaqData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleAccordion = (index) => {
    setOpenAccordionIndex(index === openAccordionIndex ? -1 : index);
  };

  return (
    <>
      <HeaderFour />
      <section className="pt-60 bg-violet-light">
        <div className="container" data-aos="slide-up">
          <h1 className="text-center mb-50">Frequently Asked Questions</h1>
          <div className="accordions">
            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                title={faq.question}
                content={faq.answer}
                isOpen={index === openAccordionIndex}
                toggleAccordion={() => toggleAccordion(index)}
              />
            ))}
          </div>
        </div>
      </section>
      <FooterFour />
    </>
  );
};

export default FAQ;
