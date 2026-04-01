import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import api from './api';
import AdminPanel from './components/AdminPanel';
import InstructorPanel from './components/InstructorPanel';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/users/login', { email, password });
      onLogin(res.data);
      if (res.data.role === 'ADMIN') navigate('/admin');
      else navigate('/instructor');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
          <h2 style={{ fontSize: '1.6rem' }}>EduSchedule</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Lecture Scheduling Module</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', color: '#fca5a5', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@test.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>Demo Credentials</strong>
          <div>Admin: <span style={{ color: 'var(--text-main)' }}>admin@test.com</span> / <span style={{ color: 'var(--text-main)' }}>password123</span></div>
          <div style={{ marginTop: '0.25rem' }}>Instructor: Email/Password you added in Admin Dashboard</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-brand">EduSchedule</div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-purple">{user.role}</span>
            <span style={{ fontWeight: 600 }}>{user.name || 'Admin'}</span>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage onLogin={setUser} />} />
        <Route path="/admin" element={user && user.role === 'ADMIN' ? <AdminPanel /> : <LoginPage onLogin={setUser} />} />
        <Route path="/instructor" element={user && user.role === 'INSTRUCTOR' ? <InstructorPanel instructorId={user._id} /> : <LoginPage onLogin={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
