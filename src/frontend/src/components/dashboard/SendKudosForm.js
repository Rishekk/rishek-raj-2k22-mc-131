import React, { useState } from 'react'; // Removed useEffect
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

// Accept 'users' as a prop
const SendKudosForm = ({ users, onKudosSent }) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { refreshUser } = useAuth();

  // We no longer need the useEffect that was here,
  // because the 'users' list is coming from the Dashboard parent.

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/recognitions', { recipientId, amount: parseInt(amount), message });
      setSuccess('Kudos sent successfully!');
      setRecipientId('');
      setAmount('');
      setMessage('');
      refreshUser(); 
      onKudosSent(); 
    } catch (err) {
      setError(err.response.data.msg || 'Failed to send kudos.');
    }
  };

  return (
    <div className="card">
      <form onSubmit={onSubmit}>
        <h3>Send Kudos</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className="form-group">
          <label>To:</label>
          <select value={recipientId} onChange={(e) => setRecipientId(e.target.value)} required>
            <option value="">Select a student</option>
            {/* Map over the 'users' prop */}
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.g.target.value)}
            required
          ></textarea>
        </div>
        <input type="submit" value="Send" className="btn" />
      </form>
    </div>
  );
};

export default SendKudosForm;