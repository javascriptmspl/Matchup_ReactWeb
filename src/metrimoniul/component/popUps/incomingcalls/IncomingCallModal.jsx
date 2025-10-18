import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../../../base';
import toast from 'react-hot-toast';

const IncomingCallModal = ({ 
    show, 
    onHide, 
    selectedUser, 
    currentUserId, 
    selectedRoomId, 
    callId, 
    isIncomingCall = false,
    callerName = null 
}) => {
    const [isCalling, setIsCalling] = useState(false);
    const [callInitiated, setCallInitiated] = useState(false);
    const [callConnected, setCallConnected] = useState(false);
    const [callStartTime, setCallStartTime] = useState(null);
    const [callDuration, setCallDuration] = useState(0);

    // Timer effect for call duration
    useEffect(() => {
        let interval;
        if (callConnected && callStartTime) {
            interval = setInterval(() => {
                const now = new Date();
                const duration = Math.floor((now - callStartTime) / 1000);
                setCallDuration(duration);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [callConnected, callStartTime]);

    // Poll for call status updates when call is initiated (for outgoing calls)
    useEffect(() => {
        let pollInterval;
        if (callInitiated && !callConnected && callId && !isIncomingCall) {
            pollInterval = setInterval(async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/chat/calls/${callId}/status`);
                    if (response.data.isSuccess && response.data.data.status === 'connected') {
                        setCallConnected(true);
                        setCallStartTime(new Date());
                        setCallDuration(0);
                        clearInterval(pollInterval);
                        
                        toast.success('Call Connected!', {
                            duration: 2000,
                            position: 'top-center',
                            style: {
                                background: '#28a745',
                                color: '#fff',
                                fontWeight: '500',
                            },
                            icon: '✅',
                        });
                    } else if (response.data.isSuccess && response.data.data.status === 'declined') {
                        setCallInitiated(false);
                        setCallConnected(false);
                        clearInterval(pollInterval);
                        onHide();
                        
                        toast('Call declined by receiver', {
                            duration: 2000,
                            position: 'top-center',
                            style: {
                                background: '#ffc107',
                                color: '#000',
                                fontWeight: '500',
                            },
                            icon: '📵',
                        });
                    }
                } catch (error) {
                    console.error('Error checking call status:', error);
                }
            }, 2000); // Poll every 2 seconds
        }
        
        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [callInitiated, callConnected, callId, isIncomingCall, onHide]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };



    const handleAnswerCall = async () => {
        if (!callId || !currentUserId) {
            toast.error('Missing call information. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#dc3545',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
            return;
        }
    
        setIsCalling(true);
    
        try {
            // API call according to Swagger: POST /chat/calls/{callId}/answer
            const response = await axios.post(`${BASE_URL}/chat/calls/${callId}/answer`, {
                userId: currentUserId
            });
    
            const data = response.data;
    
            if (data.isSuccess) {
                // Show call accepted status
                toast.success('Call Accepted! Voice call is now active.', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#28a745',
                        color: '#fff',
                        fontWeight: '500',
                    },
                    icon: '✅',
                });
    
                // Update the call status for both caller and receiver
                setCallConnected(true);
                setCallStartTime(new Date());
                setCallDuration(0);
    
                // Show call continuation message
                setTimeout(() => {
                    toast('Call connected! Timer started.', {
                        duration: 2000,
                        position: 'top-center',
                        style: {
                            background: '#28a745',
                            color: '#fff',
                            fontWeight: '500',
                        },
                        icon: '✅',
                    });
                }, 1000);
    
                // Keep modal open - don't close it automatically
            } else {
                throw new Error(data.message || 'Failed to answer call');
            }
        } catch (error) {
            console.error('Error answering call:', error);
            toast.error('Failed to answer call. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#dc3545',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
        } finally {
            setIsCalling(false);
        }
    };
    const handleDeclineCall = async () => {
        console.log('Decline call clicked - callId:', callId, 'currentUserId:', currentUserId);
        
        if (!callId || !currentUserId) {
            console.error('Missing call information for decline:', { callId, currentUserId });
            toast.error('Missing call information. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#dc3545',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
            return;
        }

        setIsCalling(true);
        console.log('Calling decline API...');

        try {
            // API call according to Swagger: POST /chat/calls/{callId}/decline
            const response = await axios.post(`${BASE_URL}/chat/calls/${callId}/decline`, {
                userId: currentUserId
            });

            console.log('Decline API response:', response.data);
            const data = response.data;

            if (data.isSuccess) {
                console.log('Call declined successfully');
                // Show declined message
                toast('Call declined successfully', {
                    duration: 2000,
                    position: 'top-center',
                    style: {
                        background: '#ffc107',
                        color: '#000',
                        fontWeight: '500',
                    },
                    icon: '📵',
                });
                
                // Reset call states and close modal
                setCallConnected(false);
                setCallInitiated(false);
                setIsCalling(false);
                onHide();
            } else {
                console.error('Decline API failed:', data.message);
                throw new Error(data.message || 'Failed to decline call');
            }
        } catch (error) {
            console.error('Error declining call:', error);
            toast.error('Failed to decline call. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#dc3545',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
        } finally {
            setIsCalling(false);
        }
    };

    const handleCancelCall = () => {
        setCallInitiated(false);
        setIsCalling(false);
        onHide();
    };

    const handleEndCall = () => {
        setCallConnected(false);
        setCallInitiated(false);
        setIsCalling(false);
        setCallStartTime(null);
        setCallDuration(0);
        onHide();
    };

    const handleStartVoiceCall = async () => {
        if (!selectedUser || !currentUserId || !selectedRoomId) {
            toast.error('Missing call information. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#dc3545',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
            return;
        }

        setIsCalling(true);

        try {
            // API call according to Swagger: POST /chat/calls/initiate
            const response = await axios.post(`${BASE_URL}/chat/calls/initiate`, {
                userId: currentUserId,
                calleeId: selectedUser._id,
                roomId: selectedRoomId,
                callType: 'audio'
            });

            const data = response.data;

            if (data.isSuccess) {
                toast.success('Voice call initiated successfully!', {
                    duration: 2000,
                    position: 'top-center',
                    style: {
                        background: '#28a745',
                        color: '#fff',
                        fontWeight: '500',
                    },
                    icon: '📞',
                });

                // Set call as initiated to show "Calling..." state
                setCallInitiated(true);
                setIsCalling(false);
            } else {
                throw new Error(data.message || 'Failed to initiate call');
            }
        } catch (error) {
            console.error('Error initiating call:', error);
            toast.error('Failed to start voice call. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#dc3545',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
        } finally {
            setIsCalling(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="incoming-call-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isIncomingCall ? 'Incoming Call' : callInitiated ? 'Calling...' : callConnected ? `Call Connected - ${formatTime(callDuration)}` : 'Voice Call'}
                </Modal.Title>
            </Modal.Header>
            

<Modal.Body>
    <div className="call-info text-center">
        <div style={{ marginBottom: '20px' }}>
            <img
                src={selectedUser?.avatar || '/default-avatar.png'}
                alt={selectedUser?.name || 'User'}
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '15px'
                }}
            />
        </div>
        <p><strong>{selectedUser?.name || callerName || 'User'}</strong></p>
        <p style={{ color: '#666', fontSize: '14px' }}>
            {isIncomingCall ? 'Incoming voice call' : callInitiated ? 'Waiting for response...' : callConnected ? 'Voice call is active' : 'Ready to start voice call'}
        </p>
        {callConnected && (
            <div style={{ marginTop: '10px' }}>
                <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#28a745',
                    fontFamily: 'monospace'
                }}>
                    {formatTime(callDuration)}
                </div>
                <small style={{ color: '#666' }}>Call Duration</small>
            </div>
        )}
    </div>
</Modal.Body>
           

<Modal.Footer className="justify-content-center">
    {isIncomingCall && callConnected ? (
        <>
            <Button 
                variant="danger" 
                onClick={handleEndCall}
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                 End Call
            </Button>
        </>
    ) : isIncomingCall ? (
        <>
            <Button 
                variant="success" 
                onClick={handleAnswerCall}
                disabled={isCalling}
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                {isCalling ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Answering...
                    </>
                ) : (
                    <>
                         Answer Call
                    </>
                )}
            </Button>
            <Button 
                variant="danger" 
                onClick={handleDeclineCall}
                disabled={isCalling}
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                {isCalling ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Declining...
                    </>
                ) : (
                    <>
                         Decline
                    </>
                )}
            </Button>
        </>
    ) : (callConnected || (callInitiated && callConnected)) ? (
        <>
            <Button 
                variant="danger" 
                onClick={handleEndCall}
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                 End Call
            </Button>
        </>
    ) : callInitiated ? (
        <>
            <Button 
                variant="warning" 
                disabled
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Calling...
            </Button>
            <Button 
                variant="danger" 
                onClick={handleCancelCall}
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                 Cancel Call
            </Button>
        </>
    ) : (
        <>
            <Button 
                variant="success" 
                onClick={handleStartVoiceCall}
                disabled={isCalling}
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                {isCalling ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Starting Call...
                    </>
                ) : (
                    <>
                         Start Voice Call
                    </>
                )}
            </Button>
            <Button 
                variant="secondary" 
                onClick={onHide}
                disabled={isCalling}
                style={{
                    padding: '10px 30px',
                    borderRadius: '25px',
                    fontWeight: '500'
                }}
            >
                Cancel
            </Button>
        </>
    )}
</Modal.Footer>
        </Modal>
    );
};

export default IncomingCallModal;
