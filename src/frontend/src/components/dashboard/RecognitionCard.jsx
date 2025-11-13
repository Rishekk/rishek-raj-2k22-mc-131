import React, { useState } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const RecognitionCard = ({ recognition, onEndorse }) => {
  const { user } = useAuth();
  const [endorseCount, setEndorseCount] = useState(recognition.endorsements.length);
  const [endorsed, setEndorsed] = useState(recognition.endorsements.includes(user._id));

  const handleEndorse = async () => {
    if (endorsed) return; // Don't allow double-endorsing
    try {
      await api.post(`/recognitions/${recognition._id}/endorse`);
      setEndorsed(true);
      setEndorseCount(prev => prev + 1);
      
      // --- FIX: This line is now uncommented to use the prop ---
      onEndorse(); 
      // --------------------------------------------------------

    } catch (err) {
      console.error('Failed to endorse', err);
    }
  };

  return (
    <div className="card">
      <p>
        <strong>{recognition.sender.name}</strong> gave <strong>{recognition.amount} credits</strong> to <strong>{recognition.recipient.name}</strong>
      </p>
      <h4>"{recognition.message}"</h4>
      <div className="card-footer">
        <button onClick={handleEndorse} className="btn btn-light" disabled={endorsed}>
          👏 {endorsed ? 'Endorsed' : 'Endorse'} ({endorseCount})
        </button>
        <span style={{ float: 'right' }}>
          {new Date(recognition.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default RecognitionCard;