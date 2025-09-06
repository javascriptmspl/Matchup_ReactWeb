import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const BlockedProfilesModal = ({ showModal, hideModal }) => {
    if (!showModal) return null;

    const handleUnblock = (userId) => {
        console.log(`Unblock user with ID: ${userId}`);
    };

    const blockedUsers = [
        { id: 1, name: 'User One', email: 'userone@example.com' },
        { id: 2, name: 'User Two', email: 'usertwo@example.com' },
        // Add more users as needed
    ];

    return (
        <Modal show={showModal} onHide={hideModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Blocked Users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blockedUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleUnblock(user.id)}
                                    >
                                        Unblock
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BlockedProfilesModal;
