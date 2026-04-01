import { useState, useEffect } from 'react';
import api from '../api';
import { FaCalendarCheck, FaBook } from 'react-icons/fa';

export default function InstructorPanel({ instructorId }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await api.get(`/lectures/${instructorId}`);
        const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLectures(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (instructorId) {
      fetchLectures();
    }
  }, [instructorId]);

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading schedule...</div>;

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <FaCalendarCheck color="var(--primary)" /> My Schedule
      </h2>

      {lectures.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
          <FaCalendarCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No Lectures Assigned</h3>
          <p style={{ color: 'var(--text-muted)' }}>You have no upcoming lectures scheduled at the moment.</p>
        </div>
      ) : (
        <div className="grid-3">
          {lectures.map(lecture => (
            <div key={lecture._id} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <FaBook size={16} /> {lecture.courseId?.name || 'Unknown Course'}
                  </h3>
                  <span className="badge badge-blue">{lecture.courseId?.level || 'N/A'}</span>
                </div>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(79, 70, 229, 0.2)', color: '#818CF8', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold', textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{new Date(lecture.date).toLocaleString('default', { month: 'short' })}</div>
                  <div style={{ fontSize: '1.2rem' }}>{new Date(lecture.date).getDate()}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Scheduled Date</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{lecture.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
