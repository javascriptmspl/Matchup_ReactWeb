import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../../../base';
import socketService from '../../../../services/SocketService';

const VideoCallModal = ({ 
    show, 
    onHide, 
    selectedUser, 
    currentUserId, 
    selectedRoomId,
    isIncomingCall = false,
    callId = null,
    callerName = null,
    initialCallConnected = false,
    initialCallStartTime = null
}) => {
    const [isCalling, setIsCalling] = useState(false);
    const [callInitiated, setCallInitiated] = useState(false);
    const [callConnected, setCallConnected] = useState(initialCallConnected);
    const [callStartTime, setCallStartTime] = useState(initialCallStartTime ? new Date(initialCallStartTime) : null);
    const [callDuration, setCallDuration] = useState(0);
    const [currentCallId, setCurrentCallId] = useState(callId || null);
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Sync props with state when modal opens
    useEffect(() => {
        if (show) {
            if (initialCallConnected) {
                setCallConnected(true);
            }
            if (initialCallStartTime) {
                setCallStartTime(new Date(initialCallStartTime));
            }
            if (callId) {
                setCurrentCallId(callId);
            }
        }
    }, [show, initialCallConnected, initialCallStartTime, callId]);

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
            toast.error('Missing call information. Please select a user first.', {
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

        // Check if socket is connected
        if (!socketService.isConnected) {
            toast.error('Not connected to server. Please refresh the page.', {
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
            // Use socket to initiate call
            console.log('Initiating video call:', { 
                calleeId: selectedUser._id, 
                roomId: selectedRoomId, 
                callType: 'video' 
            });
            socketService.initiateCall(selectedUser._id, selectedRoomId, 'video');
            
            setCallInitiated(true);
            toast.success('Calling...', {
                duration: 2000,
                position: 'top-center'
            });
        } catch (error) {
            console.error('Error initiating video call:', error);
            toast.error('Call failed. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#dc3545',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
            setCallInitiated(false);
            setIsCalling(false);
        }
    };

    const handleAnswerCall = () => {
        if (!callId || !currentUserId) {
            toast.error('Missing call information');
            return;
        }

        setIsCalling(true);
        socketService.answerCall(callId);  // socket emit call answer event
        // Don't set callConnected here - wait for call_started event from server
        toast.success("Answering call...", {
            duration: 2000,
            position: 'top-center'
        });
    };

    const handleDeclineCall = () => {
        socketService.declineCall(callId);
        toast("Call Declined");
        setCallInitiated(false);
        setIsCalling(false);
        stopLocalStream();
        onHide();
    };

    const handleEndCall = () => {
        const idToEnd = currentCallId || callId;
        if (idToEnd) {
            socketService.endCall(idToEnd, "user-ended");
        }
        setCallConnected(false);
        setCallInitiated(false);
        setIsCalling(false);
        setCallStartTime(null);
        setCallDuration(0);
        stopLocalStream();
        onHide();
    };

    const handleClose = () => {
        stopLocalStream();
        onHide();
    };

    // Socket event handlers for video calls
    useEffect(() => {
        const handleCallInitiated = (data) => {
            console.log("📞 VIDEO CALL_INITIATED event: ", data);
            
            // When we initiate a call, we get the callSessionId back
            if (data.callSessionId) {
                setCurrentCallId(data.callSessionId);
                console.log("Video call initiated with session ID:", data.callSessionId);
                // Keep callInitiated true to show "Calling..." state
            }
        };

        const handleCallStarted = (data) => {
            console.log("📞 VIDEO CALL_STARTED event: ", data);
            
            // Only handle if this is for our call
            if (data.callSessionId && (data.callSessionId === currentCallId || data.callSessionId === callId)) {
                setCallConnected(true);
                setCallInitiated(false);
                setIsCalling(false);
                
                // Only update call start time if not already set
                setCallStartTime(prevTime => prevTime || new Date());
                
                toast.success("Call connected!", {
                    duration: 2000,
                    position: 'top-center'
                });
            } else if (data.callSessionId && !currentCallId && !callId) {
                // If we don't have a callId yet, use the one from call_started
                setCurrentCallId(data.callSessionId);
                setCallConnected(true);
                setCallInitiated(false);
                setIsCalling(false);
                setCallStartTime(prevTime => prevTime || new Date());
                
                toast.success("Call connected!", {
                    duration: 2000,
                    position: 'top-center'
                });
            }
        };

        const handleCallError = (data) => {
            console.error("📞 VIDEO CALL_ERROR event: ", data);
            const errorMessage = data?.message || 'Call error occurred';
            
            if (errorMessage.includes('already in progress') || errorMessage.includes('Call already in progress')) {
                toast.error('Another call is already in progress. Please end the current call first.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#dc3545',
                        color: '#fff',
                        fontWeight: '500',
                    },
                    icon: '⚠️',
                });
                setCallConnected(false);
                setCallInitiated(false);
                setIsCalling(false);
                stopLocalStream();
                onHide();
            } else {
                toast.error(errorMessage, {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#dc3545',
                        color: '#fff',
                        fontWeight: '500',
                    },
                    icon: '❌',
                });
                setCallInitiated(false);
                setIsCalling(false);
            }
        };

        const handleCallEnded = (data) => {
            console.log("📞 VIDEO CALL_ENDED event: ", data);
            if (data.callSessionId && (data.callSessionId === currentCallId || data.callSessionId === callId)) {
                setCallConnected(false);
                setCallInitiated(false);
                setIsCalling(false);
                stopLocalStream();
                onHide();
            }
        };

        const handleCallDeclined = (data) => {
            console.log("📞 VIDEO CALL_DECLINED event: ", data);
            if (data.callSessionId && (data.callSessionId === currentCallId || data.callSessionId === callId)) {
                setCallInitiated(false);
                setIsCalling(false);
                stopLocalStream();
                onHide();
            }
        };

        // Listen for call events
        socketService.on("call_initiated", handleCallInitiated);
        socketService.on("call_started", handleCallStarted);
        socketService.on("call_error", handleCallError);
        socketService.on("call_ended", handleCallEnded);
        socketService.on("call_declined", handleCallDeclined);

        return () => {
            socketService.off("call_initiated", handleCallInitiated);
            socketService.off("call_started", handleCallStarted);
            socketService.off("call_error", handleCallError);
            socketService.off("call_ended", handleCallEnded);
            socketService.off("call_declined", handleCallDeclined);
        };
    }, [currentCallId, callId]);

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
