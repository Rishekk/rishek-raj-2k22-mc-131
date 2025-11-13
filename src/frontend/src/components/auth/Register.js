import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" value={name} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={email} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" value={password} onChange={onChange} required />
      </div>
      <input type="submit" value="Register" className="btn" />
    </form>
  );
};
export default Register;