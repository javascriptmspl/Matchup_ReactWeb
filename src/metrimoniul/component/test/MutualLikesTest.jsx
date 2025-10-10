import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkMutualActivities } from '../../../service/common-service/getuserbyGender';

const MutualLikesTest = () => {
  const dispatch = useDispatch();
  const [userId1, setUserId1] = useState('');
  const [userId2, setUserId2] = useState('');
  const [modeId, setModeId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testMutualLikes = async () => {
    if (!userId1 || !userId2 || !modeId) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(checkMutualActivities({
        userId1,
        userId2,
        modeId
      })).unwrap();
      
      setResult(response);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h3>Test Mutual Likes API</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>User ID 1:</label>
        <input
          type="text"
          value={userId1}
          onChange={(e) => setUserId1(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="Enter first user ID"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>User ID 2:</label>
        <input
          type="text"
          value={userId2}
          onChange={(e) => setUserId2(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="Enter second user ID"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Mode ID:</label>
        <input
          type="text"
          value={modeId}
          onChange={(e) => setModeId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="Enter mode ID"
        />
      </div>

      <button
        onClick={testMutualLikes}
        disabled={loading}
        style={{
          backgroundColor: '#f24570',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Mutual Likes'}
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4>Result:</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MutualLikesTest;

