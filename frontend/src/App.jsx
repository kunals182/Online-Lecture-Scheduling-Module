import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import InstructorPanel from './components/InstructorPanel';
import api from './api';
import { FaLock, FaUser, FaSignInAlt } from 'react-icons/fa';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="login-container animate-fade-in" style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)'
      }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              background: 'var(--primary)', 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              display: 'inline-flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 16px rgba(138, 92, 248, 0.3)'
            }}>
              <FaLock color="white" size={24} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)' }}>Login to manage your lectures</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <FaUser size={12} /> Email Address
              </label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@test.com"
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <FaLock size={12} /> Password
              </label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>

            {error && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem', 
                fontSize: '0.85rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
              <FaSignInAlt /> Login to Dashboard
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Interview Candidate: <strong>admin@test.com / password123</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, var(--primary), #b088ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Lecture Scheduler
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={user.role === 'ADMIN' ? <AdminPanel /> : <InstructorPanel instructorId={user._id} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
          &copy; 2026 Online Lecture Scheduling Module. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
