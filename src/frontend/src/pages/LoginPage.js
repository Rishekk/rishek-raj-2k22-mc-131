import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="form-container">
      <h1>Login</h1>
      <Login />
    </div>
  );
};
export default LoginPage;