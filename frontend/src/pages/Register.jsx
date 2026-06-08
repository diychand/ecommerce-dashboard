import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { ...form, role: 'customer' });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch {
      setError('Registration failed. Email may already be in use.');
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post('/auth/google', { credential: credentialResponse.credential });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch {
      setError('Google signup failed. Try again.');
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
        {/* Background decorations */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(230,57,70,0.08)' }}></div>
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }}></div>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>💎</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>LuxeShop</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: 2, textTransform: 'uppercase' }}>Premium Collection</div>
        </div>

        {/* Features */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 320 }}>
          {[
            ['💎', 'Exclusive Jewelry', 'Handcrafted pieces from top artisans'],
            ['👗', 'Designer Dresses', 'Latest fashion for every occasion'],
            ['🚚', 'Free Shipping', 'On all orders above $100'],
            ['↩️', 'Easy Returns', '30-day hassle-free returns'],
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
        padding: '60px 40px', overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>
            Create your account
          </h2>
          <p style={{ margin: '0 0 32px', color: '#999', fontSize: 15 }}>
            Already have one?{' '}
            <Link to="/customer/login" style={{ color: '#e63946', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
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
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'stretch' }}>
            <div style={{ width: '100%' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google signup failed')}
                width="420"
                text="signup_with"
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: '#eee' }}></div>
            <span style={{ color: '#bbb', fontSize: 13 }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#eee' }}></div>
          </div>

          {/* Name + Email row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Full Name</label>
              <input
                type="text" name="name" placeholder="Jane Doe"
                value={form.name} onChange={handleChange}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1.5px solid #e8e8e8', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit', color: '#1a1a2e'
                }}
                onFocus={e => e.target.style.borderColor = '#1a1a2e'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Email Address</label>
            <input
              type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 10,
                border: '1.5px solid #e8e8e8', fontSize: 14, outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit', color: '#1a1a2e'
              }}
              onFocus={e => e.target.style.borderColor = '#1a1a2e'}
              onBlur={e => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>

          {/* Password row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Password</label>
              <input
                type="password" name="password" placeholder="Min. 6 chars"
                value={form.password} onChange={handleChange}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1.5px solid #e8e8e8', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#1a1a2e'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Confirm</label>
              <input
                type="password" name="confirm" placeholder="Repeat password"
                value={form.confirm} onChange={handleChange}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1.5px solid #e8e8e8', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#1a1a2e'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              backgroundColor: loading ? '#999' : '#1a1a2e', color: 'white',
              fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 16, letterSpacing: 0.3
            }}
            onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#e63946'; }}
            onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = '#1a1a2e'; }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

          <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', margin: 0 }}>
            By creating an account you agree to our{' '}
            <span style={{ color: '#1a1a2e', fontWeight: 600, cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: '#1a1a2e', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;