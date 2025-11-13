import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Spinner from '../components/layout/Spinner';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard?limit=20');
        setLeaders(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2>🏆 Top Recipients</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Credits Received</th>
            <th>Recognitions</th>
            <th>Endorsements</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={leader._id}>
              <td>{index + 1}</td>
              <td>{leader.name}</td>
              <td>{leader.totalCreditsReceived}</td>
              <td>{leader.recognitionCount}</td>
              <td>{leader.totalEndorsements}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;