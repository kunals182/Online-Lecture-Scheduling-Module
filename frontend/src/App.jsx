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
      <div className="login-page" style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(138,92,248,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>

        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '3rem', position: 'relative', zIndex: 1, background: 'rgba(23, 27, 34, 0.8)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
              width: '64px', 
              height: '64px', 
              borderRadius: '18px', 
              display: 'inline-flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 10px 25px var(--primary-glow)',
              transform: 'rotate(-5deg)'
            }}>
              <FaLock color="white" size={28} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Lecture Scheduler</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@test.com"
                  style={{ paddingLeft: '3rem' }}
                  required 
                />
                <FaUser size={14} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password Key</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{ paddingLeft: '3rem' }}
                  required 
                />
                <FaLock size={14} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {error && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                padding: '0.9rem', 
                borderRadius: '12px', 
                marginBottom: '1.5rem', 
                fontSize: '0.85rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem' }}>
              Identify & Sign In <FaSignInAlt />
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              Evaluation Credentials: <br/> 
              <strong style={{ color: 'var(--accent)' }}>admin@test.com / password123</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaLock color="white" size={14} />
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Scheduler<span style={{ color: 'var(--accent)', WebkitTextFillColor: 'var(--accent)' }}>.io</span>
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' } /* Simple responsive hide placeholder */}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 8px var(--success)' }}></div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role} Account</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Sign Out
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

        <footer className="container" style={{ padding: '3rem 0', textAlign: 'center', opacity: 0.4, fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          &copy; 2026 Academic Planning & Scheduling Module. Built for performance.
        </footer>
      </div>
    </Router>
  );
}


export default App;
