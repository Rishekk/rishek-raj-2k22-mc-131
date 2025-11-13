import React from 'react';
import { Navigate } from 'react-router-dom';
import Register from '../components/auth/Register';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="form-container">
      <h1>Register</h1>
      <Register />
    </div>
  );
};
export default RegisterPage;