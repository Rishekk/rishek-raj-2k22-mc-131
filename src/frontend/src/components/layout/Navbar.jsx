import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <div className="user-info">
        <span>Give: {user?.sendingBalance}</span>
        <span>Redeem: {user?.receivedBalance}</span>
      </div>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/redeem">Redeem</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
        <li><a onClick={onLogout} href="#!">Logout</a></li>
      </ul>
    </>
  );

  const guestLinks = (
    <ul>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1><Link to="/">Boostly</Link></h1>
      {user ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;