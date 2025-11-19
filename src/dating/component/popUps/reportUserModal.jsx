import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportUserModal = ({ showModal, hideModal }) => {
  const [reportReason, setReportReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const handleReport = () => {
    hideModal();
  };

  const reportOptions = [
    'Inappropriate Content',
    'Harassment',
    'Fake Profile',
    'Spam',
    'Other (Please Specify)',
  ];

  return (
    <>
    <style>{`
      .rb-backdrop-blur { backdrop-filter: blur(6px); background-color: rgba(0,0,0,0.35) !important; z-index: 50010 !important; }
      .modal.rb-call-modal { z-index: 50020 !important; }
    `}</style>
    <Modal show={showModal} onHide={hideModal} centered className="rb-call-modal" backdropClassName="rb-backdrop-blur">
      <span onClick={hideModal}>
        <i
          className="fa fa-times fs-3"
          aria-hidden="true"
          style={{
            cursor: 'pointer',
            float: 'right',
            padding: '15px 25px 0 0',
          }}
        ></i>
      </span>
      <div className="container px-5 pb-5">
        <div className="row">
          <div className="col-12">
            <p className='text-center text-dark fs-3'>Report User</p>
          </div>
          <div className="col-12 px-5">
            <p className='text-center'>
              Are you sure you want to report this user?
            </p>
          </div>
          <Form.Group controlId="reportReason">
            <Form.Label>Select a reason:</Form.Label>
            <Form.Control
            className='custom-reportUser-modal'
              as="select"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="" disabled>Select a reason...</option>
              {reportOptions.map((option) => (
                <option   key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <span className='mt-4'></span>
          <Form.Group  controlId="additionalDetails">
            <Form.Label>Additional Details (optional):</Form.Label>
            <Form.Control
            className='custom-reportUser-modal'
              as="textarea"
              rows={3}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Provide more details about the report..."
            />
          </Form.Group>
          <div className="container">
            <div className="row share-user-profile-modal-svg-div">
              <div className="col-6 text-center mt-4">
                <Button variant="default" onClick={hideModal}>
                  Cancel
                </Button>
              </div>
              <div className="col-6 text-center mt-4">
                <Button variant="danger" onClick={handleReport}>
                  Report User
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default ReportUserModal;
