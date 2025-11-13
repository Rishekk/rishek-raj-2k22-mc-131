import React, { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const RedeemPage = () => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    try {
      const res = await api.post('/redeem', { amountToRedeem: parseInt(amount) });
      setSuccess(res.data);
      setAmount('');
      refreshUser(); // Update the navbar balance
    } catch (err) {
      setError(err.response.data.msg || 'Redemption failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Redeem Credits</h2>
      <h3>Your balance: {user?.receivedBalance} credits</h3>
      <p>Credits are redeemed at a rate of ₹5 per credit.</p>
      
      <form onSubmit={onSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && (
          <div style={{ padding: '1rem', backgroundColor: '#e6ffe6', border: '1px solid green', marginBottom: '1rem' }}>
            <h4>Redemption Successful!</h4>
            <p><strong>Voucher Code:</strong> {success.voucherCode}</p>
            <p><strong>Value:</strong> ₹{success.voucherValue}</p>
          </div>
        )}
        <div className="form-group">
          <label>Amount to Redeem:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            max={user?.receivedBalance}
            required
          />
        </div>
        <input type="submit" value="Redeem" className="btn" />
      </form>
    </div>
  );
};

export default RedeemPage;