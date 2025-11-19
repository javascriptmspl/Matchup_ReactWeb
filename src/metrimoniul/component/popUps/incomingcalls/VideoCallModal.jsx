import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../../../base';

const VideoCallModal = ({ 
    show, 
    onHide, 
    selectedUser, 
    currentUserId, 
    selectedRoomId,
    isIncomingCall = false,
    callId = null,
    callerName = null
}) => {
    const [isCalling, setIsCalling] = useState(false);
    const [callInitiated, setCallInitiated] = useState(false);
    const [callConnected, setCallConnected] = useState(false);
    const [callStartTime, setCallStartTime] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const [currentCallId, setCurrentCallId] = useState(callId || null);
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        let interval;
        if (callConnected && callStartTime) {
            interval = setInterval(() => {
                const now = new Date();
                const duration = Math.floor((now - callStartTime) / 1000);
                setCallDuration(duration);
            }, 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [callConnected, callStartTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Request camera/mic when modal opens, release on close
    useEffect(() => {
        let cancelled = false;
        const startLocal = async () => {
            if (!show) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (cancelled) return;
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('getUserMedia error:', err);
                toast.error('Unable to access camera/microphone', {
                    duration: 2500,
                    position: 'top-center',
                    style: { background: '#dc3545', color: '#fff', fontWeight: '500' },
                    icon: '🎥',
                });
            }
        };
        startLocal();
        return () => {
            cancelled = true;
            if (localStream) {
                localStream.getTracks().forEach(t => t.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const stopLocalStream = () => {
        if (localStream) {
            localStream.getTracks().forEach(t => t.stop());
            setLocalStream(null);
        }
    };

    const handleStartVideoCall = async () => {
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
            const response = await axios.post(`${BASE_URL}/chat/calls/initiate`, {
                userId: currentUserId,
                calleeId: selectedUser._id,
                roomId: selectedRoomId,
                callType: 'video'
            });

            const data = response.data;

            if (data.isSuccess) {
                toast.success('Video call initiated successfully!', {
                    duration: 2000,
                    position: 'top-center',
                    style: {
                        background: '#28a745',
                        color: '#fff',
                        fontWeight: '500',
                    },
                    icon: '🎥',
                });
                // Stay in modal, show "Calling..." state
                setCallInitiated(true);
                const newCallId = response?.data?.data?.call?._id || response?.data?.data?._id || response?.data?.data?.id;
                if (newCallId) { setCurrentCallId(newCallId); }
            } else {
                throw new Error(data.message || 'Failed to initiate call');
            }
        } catch (error) {
            console.error('Error initiating video call:', error);
            toast.error('Failed to start video call. Please try again.', {
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

    const handleAnswerCall = async () => {
        if (!callId || !currentUserId) {
            toast.error('Missing call information. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: { background: '#dc3545', color: '#fff', fontWeight: '500' },
                icon: '❌',
            });
            return;
        }
        setIsCalling(true);
        try {
            const response = await axios.post(`${BASE_URL}/chat/calls/${callId}/answer`, { userId: currentUserId });
            const data = response.data;
            if (data.isSuccess) {
                toast.success('Call Accepted! Video call is now active.', {
                    duration: 3000,
                    position: 'top-center',
                    style: { background: '#28a745', color: '#fff', fontWeight: '500' },
                    icon: '✅',
                });
                setCallConnected(true);
                setCallStartTime(new Date());
                setCallDuration(0);
            } else {
                throw new Error(data.message || 'Failed to answer call');
            }
        } catch (error) {
            console.error('Error answering call:', error);
            toast.error('Failed to answer call. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: { background: '#dc3545', color: '#fff', fontWeight: '500' },
                icon: '❌',
            });
        } finally {
            setIsCalling(false);
        }
    };

    const handleDeclineCall = async () => {
        if (!callId || !currentUserId) {
            toast.error('Missing call information. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: { background: '#dc3545', color: '#fff', fontWeight: '500' },
                icon: '❌',
            });
            return;
        }
        setIsCalling(true);
        try {
            const response = await axios.post(`${BASE_URL}/chat/calls/${callId}/decline`, { userId: currentUserId });
            const data = response.data;
            if (data.isSuccess) {
                toast('Call declined successfully', {
                    duration: 2000,
                    position: 'top-center',
                    style: { background: '#ffc107', color: '#000', fontWeight: '500' },
                    icon: '📵',
                });
                setCallConnected(false);
                setCallInitiated(false);
                setIsCalling(false);
                onHide();
            } else {
                throw new Error(data.message || 'Failed to decline call');
            }
        } catch (error) {
            console.error('Error declining call:', error);
            toast.error('Failed to decline call. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: { background: '#dc3545', color: '#fff', fontWeight: '500' },
                icon: '❌',
            });
        } finally {
            setIsCalling(false);
        }
    };

    const handleEndCall = async () => {
        try {
            if (!currentCallId && !callId) {
                toast.error('Missing call id. Cannot end call.', { duration: 2000, position: 'top-center' });
            } else {
                const payload = { userId: currentUserId, reason: 'user-ended' };
                const idToEnd = currentCallId || callId;
                const res = await axios.post(`${BASE_URL}/chat/calls/${idToEnd}/end`, payload);
                if (res?.data?.isSuccess) {
                    toast.success(res?.data?.message || 'Call ended successfully', { duration: 2000, position: 'top-center' });
                } else {
                    toast.error(res?.data?.message || 'Failed to end call', { duration: 2000, position: 'top-center' });
                }
            }
        } catch (err) {
            console.error('Error ending call:', err);
            toast.error('End call failed. Please try again.', { duration: 2000, position: 'top-center' });
        } finally {
            setCallConnected(false);
            setCallInitiated(false);
            setIsCalling(false);
            setCallStartTime(null);
            setCallDuration(0);
            stopLocalStream();
            onHide();
        }
    };

    const handleClose = () => {
        stopLocalStream();
        onHide();
    };

    return (
        <>
        <style>{`
          .rb-backdrop-blur { backdrop-filter: blur(6px); background-color: rgba(0,0,0,0.35) !important; z-index: 50010 !important; }
          .modal.rb-call-modal { z-index: 50020 !important; }
        `}</style>
        <Modal show={show} onHide={handleClose} centered className="video-call-modal rb-call-modal" backdropClassName="rb-backdrop-blur">
            <Modal.Header closeButton>
                <Modal.Title>
                    {callConnected
                        ? `Video Call Connected - ${formatTime(callDuration)}`
                        : (isIncomingCall ? 'Incoming Video Call' : (callInitiated ? 'Calling...' : 'Video Call'))}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="video-call-container">
                    <div className="video-feed">
                        <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: 8, background: '#000' }} />
                    </div>
                    <div className="video-feed">
                        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 8, background: '#000' }} />
                        <small style={{ color: '#aaa' }}>{selectedUser?.name || callerName || 'User'}'s video</small>
                    </div>
                </div>
                <div className="call-info">
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        {isIncomingCall ? 'Incoming video call' : callInitiated ? 'Waiting for response...' : callConnected ? 'Video call is active' : 'Ready to start video call'}
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                {isIncomingCall && callConnected ? (
                    <>
                        <Button variant="danger" onClick={handleEndCall} style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            End Call
                        </Button>
                    </>
                ) : isIncomingCall ? (
                    <>
                        <Button variant="success" onClick={handleAnswerCall} disabled={isCalling} style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            {isCalling ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Answering...</>) : (<>Answer Call</>)}
                        </Button>
                        <Button variant="danger" onClick={handleDeclineCall} disabled={isCalling} style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            {isCalling ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Declining...</>) : (<>Decline</>)}
                        </Button>
                    </>
                ) : (callConnected || (callInitiated && callConnected)) ? (
                    <>
                        <Button variant="danger" onClick={handleEndCall} style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            End Call
                        </Button>
                    </>
                ) : callInitiated ? (
                    <>
                        <Button variant="warning" disabled style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Calling...
                        </Button>
                        <Button variant="danger" onClick={() => { setCallInitiated(false); setIsCalling(false); onHide(); }} style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            Cancel Call
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="success" onClick={handleStartVideoCall} disabled={isCalling} style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            {isCalling ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Starting...</>) : (<>Start Video Call</>)}
                        </Button>
                        <Button variant="secondary" onClick={handleClose} disabled={isCalling} style={{ padding: '10px 30px', borderRadius: '25px', fontWeight: '500' }}>
                            Cancel
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default VideoCallModal;
