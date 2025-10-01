

import React from 'react'
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { blockUser } from '../../../../service/common-service/blockSlice';

const BlockUserModalMetri = ({ showModal, hideModal, selectedUser }) => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBlockUserFromChat = () => {
    const targetUserId = selectedUser?.receiverUserId?._id;
    if (!targetUserId) return; 

    dispatch(blockUser(targetUserId))
      .unwrap()  
      .then(() => {
        hideModal();
      ;
      })
      .catch((err) => {
        console.error("Block user failed:", err);
       
      });
  };

  return (
    <Modal show={showModal} onHide={hideModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Block Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger">
          Are you sure want to block <span className='fs-5'>{selectedUser ? selectedUser.name : null}</span>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="default" style={{ border: '1px solid #d5d5d5c2' }} onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleBlockUserFromChat}>
          Block
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BlockUserModalMetri;
