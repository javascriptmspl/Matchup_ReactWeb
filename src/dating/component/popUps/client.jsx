
import React, { useState } from 'react'
import { Modal, Button, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { blockUser, unblockUser } from '../../../service/common-service/blockSlice';
import toast from 'react-hot-toast';

const BlockUserModal = ({ showModal, hideModal, selectedUser, isBlocked = false, onBlockStatusChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleBlockUserFromChat = async () => {
    if (!selectedUser || !selectedUser._id) {
      toast.error("User information is missing");
      return;
    }

    try {
      setLoading(true);
      
      if (isBlocked) {
        // Unblock the user
        const result = await dispatch(unblockUser(selectedUser._id)).unwrap();
        toast.success(`${selectedUser.name} has been unblocked successfully`);
      } else {
        // Block the user
        const result = await dispatch(blockUser(selectedUser._id)).unwrap();
        toast.success(`${selectedUser.name} has been blocked successfully`);
      }
      
      setLoading(false);
      hideModal();
      
      // Notify parent component to refresh blocking status
      if (onBlockStatusChange) {
        setTimeout(() => {
          onBlockStatusChange();
        }, 500);
      }
      
    } catch (error) {
      console.error(isBlocked ? "Error unblocking user:" : "Error blocking user:", error);
      toast.error(error?.message || `Failed to ${isBlocked ? 'unblock' : 'block'} user. Please try again.`);
      setLoading(false);
    }
  }

  return (
    <>
    <style>{`
      .rb-backdrop-blur { backdrop-filter: blur(6px); background-color: rgba(0,0,0,0.35) !important; z-index: 50010 !important; }
      .modal.rb-call-modal { z-index: 50020 !important; }
    `}</style>
    <Modal show={showModal} onHide={hideModal} centered className="rb-call-modal" backdropClassName="rb-backdrop-blur">
      <Modal.Header closeButton>
        <Modal.Title>{isBlocked ? 'Unblock' : 'Block'} Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={`alert ${isBlocked ? 'alert-info' : 'alert-danger'}`}>
          Are you sure want to {isBlocked ? 'unblock' : 'block'} <span className='fs-5'>{selectedUser ? selectedUser.name : null}</span>?
          {isBlocked && <div className="mt-2 small">You will be able to chat with this user again after unblocking.</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={hideModal} disabled={loading}>
          Cancel
        </Button>
        <Button variant={isBlocked ? "success" : "danger"} onClick={handleBlockUserFromChat} disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              {isBlocked ? 'Unblocking...' : 'Blocking...'}
            </>
          ) : (
            isBlocked ? 'Unblock' : 'Block'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default BlockUserModal;