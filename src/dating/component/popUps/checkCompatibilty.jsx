import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


// const CustomAlert = ({ message, onClose }) => (
//     <div
//       style={{
//         textAlign:"center",
//         width:"20%",
//         position: 'fixed',
//         top: '40%',
//         left:"49%",
//         transform: 'translate(-50%, -50%)',
//         backgroundColor: '#ffff',
//         padding: '20px',
//         borderRadius: '10px',
//         boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
//       }}
//     >
//       <p>{message}</p>
//       <button style={{color:"#f24570"}} onClick={onClose}>OK</button>
//     </div>
//   );
const CustomAlert = ({ message, onClose }) => (
    <div
      className="position-fixed top-50 start-50 translate-middle"
      style={{
        backgroundColor: '#ffff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        width: '80%', // Set a default width
        maxWidth: '400px', // Set a maximum width
      }}
    >
      <p>{message}</p>
      <button style={{color:"#f24570"}} className="btn btn-" onClick={onClose}>
        OK
      </button>
    </div>
  );
const CheckCompatibility = ({ showModal, hideModal }) => {
    const [customAlert, setCustomAlert] = useState(null);
    const questions = [
        'Do you prefer to be a protector or nurturer in your relationships?',
        'What is your ideal date night?',
        'How do you handle conflicts in a relationship?',
        'What is your love language?',
        'How important is physical affection in a relationship?',
    ];

    const options = [
        ['Protector', 'Nurturer', 'Sometimes protector, sometimes nurturer', 'Don’t Care'],
        ['Dinner and a movie', 'Outdoor adventure', 'Cooking together at home', 'Netflix and chill'],
        ['I confront the issue directly', 'I prefer to avoid conflicts', 'I compromise and find a middle ground'],
        ['Words of affirmation', 'Acts of service', 'Receiving gifts', 'Quality time', 'Physical touch'],
        ['Very important', 'Moderately important', 'Not important'],
    ];


    const matchingPercentage = 60;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentDiv, setCurrentDiv] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(Array(options.length).fill());
    

    const handleOptionSelect = (index) => {
        const updatedOptions = [...selectedOptions];
        updatedOptions[currentQuestion] = options[currentQuestion][index];
        setSelectedOptions(updatedOptions);
    };

    // const handleNextClick = () => {
    //     if (currentQuestion < questions.length - 1) {
    //         setCurrentQuestion(currentQuestion + 1);
    //     } else {
    //         if (selectedOptions.every((option) => option !== undefined)) {
    //             setCurrentDiv(1);
    //         } else {
    //             alert('Please answer all questions before submitting.');
    //         }
    //     }
    // };
    const handleNextClick = () => {
        if (currentQuestion < questions.length - 1) {
          if (selectedOptions[currentQuestion] === undefined) {
            // Display custom alert modal
            const message = 'Please answer the current question before moving to the next one.';
            setCustomAlert({ message });
          } else {
            setCurrentQuestion(currentQuestion + 1);
          }
        } else {
          if (selectedOptions.every((option) => option !== undefined)) {
            setCurrentDiv(1);
          } else {
            // Display custom alert modal
            const message = 'Please answer all questions before submitting.';
            setCustomAlert({ message });
          }
        }
      };

    const handlePrevClick = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    return (
        <>
        <style>{`
          .rb-backdrop-blur { backdrop-filter: blur(6px); background-color: rgba(0,0,0,0.35) !important; z-index: 50010 !important; }
          .modal.rb-call-modal { z-index: 50020 !important; }
        `}</style>
        <Modal show={showModal} onHide={hideModal} centered className="rb-call-modal" backdropClassName="rb-backdrop-blur">
           {customAlert && (
        <CustomAlert message={customAlert.message} onClose={() => setCustomAlert(null)} />
      )}
            
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
            {currentDiv === 0 && (
                <div className="container px-3 pb-3 px-sm-5 pb-sm-5">
                    <div className=" ">
                        <div className="col-12">
                            <p className='text-center text-dark fs-3'>Compatibility Quiz</p>
                        </div>
                        <div className="col-12 px-3 px-sm-5">
                            <p className='text-center'>
                                Answer at least 5 questions & find out how compatible you are with other users
                            </p>
                        </div>
                    </div>
                    <div className="compatibility-quiz-box mx-3">
                        <div className="top-quiz mb-2">
                            <p className='top-quiz-req-que text-muted'>{`Required question ${currentQuestion + 1}/${questions.length}`}</p>
                            <br />
                            <p className='top-quiz-que my-2'>{questions[currentQuestion]}</p>
                        </div>
                        <div className='py-2'>
                            {options[currentQuestion].map((option, index) => (
                                <p
                                    key={index}
                                    className={`rounded-4 top-quiz-option pointer py-3 ps-4 ${selectedOptions[currentQuestion] === option ? 'selected-option' : ''}`}
                                    onClick={() => handleOptionSelect(index)}
                                    style={{
                                        backgroundColor:
                                            selectedOptions[currentQuestion] === option ? '#f24570' : 'whitesmoke',
                                        color:
                                            selectedOptions[currentQuestion] === option ? 'white' : 'black',
                                        fontSize: '1rem', // Adjust font size as needed
                                    }}
                                >
                                    {option}
                                </p>
                            ))}
                        </div>
                        <div>
                            {currentQuestion > 0 && (
                                <button className="default-btn reverse mt-4" style={{ float: 'left' }} onClick={handlePrevClick}>
                                    <span>Prev</span>
                                </button>
                            )}
                            <button className="default-btn reverse mt-4 " style={{ float: 'right' }} onClick={handleNextClick}>
                                <span>{currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {currentDiv === 1 && (
                <div className='pb-5'>
                <div className="container px-5">
                    <div className='my-2'>
                        <div style={{ width: "150px", margin: "auto" }}>
                            <CircularProgressbar
                                maxValue={100}
                                strokeWidth={10}
                                value={matchingPercentage}
                                counterClockwise={false}
                                background={false}
                                backgroundPadding={10}
                                text={`${matchingPercentage}%`}
                                styles={buildStyles({
                                    textColor: '#f24570',
                                    pathColor: '#f24570',
                                    trailColor: 'whitesmoke',
                                })}
                            />
                        </div>
                    </div>

                    <div className="my-2 mt-5">
                        <h6>Things you have in common : </h6>
                    </div>

                    <div className= " ps-3 my-2 mt-3">
                       <p>1. You both agree that when it comes to love, it always requires hard work!</p>
                       <p>2. You both value work-life balance over success!</p>
                    </div>


                </div>
                      <hr className='my-2' />
                      <div className="container px-5">
                        <p className='text-dark fs-5 mt-2'>details</p>
                        <p className='ps-3'>Your score suggests that there is likely a low-moderate level of potential compatibility between you and this person when it comes to several important elements of successful relationships. It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
</div>
                      </div>
            )}
        </Modal>
        </>
    );
};

export default CheckCompatibility;
