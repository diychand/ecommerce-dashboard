import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.user.role !== 'customer') {
        setError('This login is for customers only!');
        setLoading(false);
        return;
      }
      login(res.data.user, res.data.token);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post('/auth/google', { credential: credentialResponse.credential });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch {
      setError('Google login failed. Try again.');
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", display: 'flex', minHeight: '100vh', margin: 0 }}>

      {/* LEFT PANEL */}
      <div style={{
        flex: 1, background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(230,57,70,0.08)' }}></div>
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }}></div>

        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>💎</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>LuxeShop</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: 2, textTransform: 'uppercase' }}>Premium Collection</div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 320 }}>
          {[
            ['🔒', 'Secure Login', 'Your data is always protected'],
            ['💎', 'Exclusive Access', 'Members-only deals and offers'],
            ['📦', 'Order Tracking', 'Real-time updates on your orders'],
            ['⭐', 'Loyalty Rewards', 'Earn points on every purchase'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                backgroundColor: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
              }}>{icon}</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, backgroundColor: '#ffffff',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 40px'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>
            Welcome back 👋
          </h2>
          <p style={{ margin: '0 0 32px', color: '#999', fontSize: 15 }}>
            New here?{' '}
            <Link to="/register" style={{ color: '#e63946', fontWeight: 700, textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fff0f0', border: '1px solid #ffc0c0',
              borderRadius: 10, padding: '12px 16px', marginBottom: 24,
              color: '#e63946', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google */}
          <div style={{ marginBottom: 24 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              width="420"
              text="continue_with"
              shape="rectangular"
              theme="outline"
              size="large"
            />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: '#eee' }}></div>
            <span style={{ color: '#bbb', fontSize: 13 }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#eee' }}></div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Email Address</label>
            <input
              type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 10,
                border: '1.5px solid #e8e8e8', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit', color: '#1a1a2e'
              }}
              onFocus={e => e.target.style.borderColor = '#1a1a2e'}
              onBlur={e => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Password</label>
            </div>
            <input
              type="password" placeholder="Enter your password"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 10,
                border: '1.5px solid #e8e8e8', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = '#1a1a2e'}
              onBlur={e => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              backgroundColor: loading ? '#999' : '#1a1a2e', color: 'white',
              fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 20, letterSpacing: 0.3
            }}
            onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#e63946'; }}
            onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = '#1a1a2e'; }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Link to="/login" style={{ color: '#bbb', fontSize: 13, textDecoration: 'none' }}>
              Admin Login →
            </Link>
          </div>

          <div style={{
            backgroundColor: '#f8f8f8', borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <span style={{ fontSize: 12, color: '#999', lineHeight: 1.5 }}>
              Your login is secured with 256-bit SSL encryption. We never store your password in plain text.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;