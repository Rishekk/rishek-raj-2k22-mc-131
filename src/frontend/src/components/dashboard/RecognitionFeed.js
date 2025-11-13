import React from 'react';
import RecognitionCard from './RecognitionCard';

const RecognitionFeed = ({ recognitions, onEndorse }) => {
  return (
    <div>
      <h2>Recent Activity</h2>
      {recognitions.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        recognitions.map(rec => (
          <RecognitionCard key={rec._id} recognition={rec} onEndorse={onEndorse} />
        ))
      )}
    </div>
  );
};

export default RecognitionFeed;