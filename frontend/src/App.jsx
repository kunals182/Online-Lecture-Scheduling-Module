import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import api from './api';
import AdminPanel from './components/AdminPanel';
import InstructorPanel from './components/InstructorPanel';
import { FaUserShield, FaChalkboardTeacher } from 'react-icons/fa';

function RoleSelect({ onLogin }) {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/instructors')
      .then(res => setInstructors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Lecture Scheduler</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Select your role to continue</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem' }}
            onClick={() => { onLogin({ role: 'ADMIN', name: 'Admin' }); navigate('/admin'); }}
          >
            <FaUserShield size={18} /> &nbsp; Admin Panel
          </button>

          {instructors.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Login as Instructor</p>
                {instructors.map(inst => (
                  <button
                    key={inst._id}
                    className="btn btn-secondary"
                    style={{ width: '100%', marginBottom: '0.5rem' }}
                    onClick={() => { onLogin({ ...inst }); navigate('/instructor'); }}
                  >
                    <FaChalkboardTeacher size={16} /> &nbsp; {inst.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {instructors.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No instructors added yet. Go to Admin Panel to add one.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-brand">EduSchedule</div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-purple">{user.role}</span>
            <span style={{ fontWeight: 600 }}>{user.name || 'Admin'}</span>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={() => { setUser(null); window.location.href = '/'; }}>
              Logout
            </button>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<RoleSelect onLogin={setUser} />} />
        <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminPanel /> : <RoleSelect onLogin={setUser} />} />
        <Route path="/instructor" element={user?.role === 'INSTRUCTOR' ? <InstructorPanel instructorId={user._id} /> : <RoleSelect onLogin={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
