
import React, { useEffect } from 'react'
import { Modal, Button } from "react-bootstrap";

const EventDelete = ({ showModal, hideModal,onDelete}) => {
    useEffect(() => {
    }, [showModal]);
   
  const message = "Are you sure want to Delete this Event ?"
    return (
        <Modal show={showModal} onHide={hideModal} centered className='dating-del-modal'>
        <Modal.Header closeButton>
          {/* <Modal.Title>Delete Confirmation</Modal.Title>   */}
        </Modal.Header>
        <Modal.Body><div className="delete-msg">{message}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="default" className='del-mod-btn' onClick={hideModal}>
            Cancel
          </Button>
          <Button variant="danger" className='cancel-mod-btn'  onClick={onDelete}>
          Delete
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default EventDelete; 