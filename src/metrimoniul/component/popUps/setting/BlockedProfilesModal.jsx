
import React, { useEffect } from 'react';
import { Modal, Button, ListGroup, Image, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getBlockedUsers, unblockUser } from '../../../../service/common-service/blockSlice';
import { BASE_URL } from '../../../../base';

const BlockedProfilesModal = ({ showModal, hideModal }) => {
    const dispatch = useDispatch();
    const blockedUsersRaw = useSelector((state) => state.block.blockedUsers);
    const blockedUsers = Array.isArray(blockedUsersRaw) ? blockedUsersRaw : [];

    const raw = localStorage.getItem('userData');
    const parsed = raw ? JSON.parse(raw) : null;
    const userId = parsed?.data?._id;

    useEffect(() => {
        if (showModal && userId) {
            dispatch(getBlockedUsers(userId));
        }
    }, [dispatch, userId, showModal]);

    const handleUnblock = async (userId) => {
        try {
            await dispatch(unblockUser(userId)).unwrap();
            // Refresh the blocked users list after successful unblock
            const currentUserId = parsed?.data?._id;
            if (currentUserId) {
                dispatch(getBlockedUsers(currentUserId));
            }
        } catch (error) {
            console.error('Failed to unblock user:', error);
        }
    };

    return (
        <Modal show={showModal} onHide={hideModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Blocked Users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {blockedUsers.length === 0 ? (
                    <p className="text-center text-muted">No blocked users found.</p>
                ) : (
                    <ListGroup variant="flush">
                        {blockedUsers.map((user) => {
                            const userInfo = user?.blocked || user;
                            const avatarSrc = userInfo?.mainAvatar
                                ? `${BASE_URL}/assets/images/${userInfo.mainAvatar}`
                                : userInfo?.avatars?.[0]
                                ? `${BASE_URL}/assets/images/${userInfo.avatars[0]}`
                                : 'https://via.placeholder.com/40';
                            return (
                                <ListGroup.Item key={userInfo._id || user.id}>
                                    <Row className="align-items-center">
                                        <Col xs={2}>
                                            <Image
                                                src={avatarSrc}
                                                roundedCircle
                                                width={50}
                                                height={40}
                                                alt="avatar"
                                            />
                                        </Col>
                                        <Col xs={7}>
                                            <div style={{ fontWeight: 'bold' }}>{userInfo.name || 'No Name'}</div>
                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                {userInfo.email || userInfo.username || '-'}
                                            </div>
                                        </Col>
                                        <Col xs={3} className="text-end">
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleUnblock(userInfo._id || user.id)}
                                            >
                                                Unblock
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                )}
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
