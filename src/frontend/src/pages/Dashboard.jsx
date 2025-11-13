import React, { useState, useEffect } from 'react';
import SendKudosForm from '../components/dashboard/SendKudosForm';
import RecognitionFeed from '../components/dashboard/RecognitionFeed';
import api from '../api/api';
import Spinner from '../components/layout/Spinner';

const Dashboard = () => {
  const [recognitions, setRecognitions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Define the async function *inside* the effect
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Start both API calls at the same time
        const recPromise = api.get('/recognitions');
        const usersPromise = api.get('/auth/users'); // Use the correct user route

        // Wait for both to finish
        const [recResponse, usersResponse] = await Promise.all([
          recPromise,
          usersPromise,
        ]);

        setRecognitions(recResponse.data);
        setUsers(usersResponse.data);

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        // This ensures loading is set to false even if there's an error
        setLoading(false);
      }
    };

    // Call the function
    loadDashboardData();
    
  }, [refreshKey]); // Refetch when refreshKey changes

  const onKudosSent = () => {
    // Increment the key to trigger a refetch
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Pass the loaded users list to the form */}
      <SendKudosForm users={users} onKudosSent={onKudosSent} />
      <RecognitionFeed recognitions={recognitions} onEndorse={onKudosSent} />
    </div>
  );
};

export default Dashboard;