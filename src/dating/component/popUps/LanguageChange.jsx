import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const LanguageChange = ({ showModal, hideModal }) => {

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "gu", name: "Gujarati" },
    { code: "mr", name: "Marathi" },
    { code: "pa", name: "Punjabi" },
    { code: "te", name: "Telugu" },
    { code: "fr", name: "French" },
    { code: "ja", name: "Japanese" },
    { code: "es", name: "Spanish" },
    { code: "ar", name: "Arabic" },
    { code: "ko", name: "Korean" },
    { code: "de", name: "German" },
    { code: "ru", name: "Russian" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);

    const googleCombo = document.querySelector(".goog-te-combo");
    if (googleCombo) {
      googleCombo.value = language.code;
      googleCombo.dispatchEvent(new Event("change"));
    }
  };

  return (
    <Modal show={showModal} onHide={hideModal} centered>
      <span onClick={hideModal}>
        <i
          className="fa fa-times fs-3"
          aria-hidden="true"
          style={{
            cursor: "pointer",
            float: "right",
            padding: "15px 25px 0 0",
          }}
        ></i>
      </span>

      <div className="container px-5 pb-5">
        <h5 className='text-center mb-4'>Select Language</h5>

        <div className="row">
          {languages.map((language, index) => (
            <div key={index} className="col-6">
              <p
                className={`rounded-4 top-quiz-option pointer py-3 ps-4 ${selectedLanguage === language.name ? "selected-option" : ""}`}
                onClick={() => handleLanguageSelect(language)}
                style={{
                  backgroundColor: selectedLanguage === language.name ? "#f24570" : "whitesmoke",
                  color: selectedLanguage === language.name ? "white" : "black",
                }}
              >
                <i className="fa fa-language me-3" aria-hidden="true"></i>
                {language.name}
              </p>
            </div>
          ))}
        </div>

        <button className="default-btn reverse mt-4" style={{ float: "right" }} onClick={hideModal}>
          <span>Save</span>
        </button>
      </div>
    </Modal>
  );
};

export default LanguageChange;
