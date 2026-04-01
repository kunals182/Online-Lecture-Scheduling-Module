import { useState, useEffect } from 'react';
import api from '../api';
import { FaCalendarCheck, FaBook } from 'react-icons/fa';

export default function InstructorPanel({ instructorId, userName }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMySchedule = async () => {
      try {
        const res = await api.get(`/lectures/${instructorId}`);
        const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLectures(sorted);
      } catch (e) {
        console.warn('Error loading schedule:', e);
      } finally {
        setLoading(false);
      }
    };
    if (instructorId) {
      getMySchedule();
    }
  }, [instructorId]);

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading schedule...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaCalendarCheck color="var(--primary)" /> Academic Schedule
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back, {userName || 'Instructor'}. Here are your upcoming sessions.</p>
      </div>

      {lectures.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FaCalendarCheck size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Quiet Academic Period</h3>
          <p style={{ color: 'var(--text-muted)' }}>No lectures are currently assigned to your profile.</p>
        </div>
      ) : (
        <div className="grid-3">
          {lectures.map(lecture => (
            <div key={lecture._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {lecture.courseId?.name || 'Session'}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-blue">{lecture.courseId?.level || 'N/A'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Lecture ID: {lecture._id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', padding: '0.8rem', borderRadius: '14px', fontWeight: '800', textAlign: 'center', minWidth: '65px', boxShadow: '0 8px 20px rgba(138, 92, 248, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>{new Date(lecture.date).toLocaleString('default', { month: 'short' })}</div>
                  <div style={{ fontSize: '1.4rem' }}>{new Date(lecture.date).getDate()}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Scheduled Date</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(lecture.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem' }}>View Assets</button>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem' }}>Confirm Attendance</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}
