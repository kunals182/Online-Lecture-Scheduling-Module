import { useState, useEffect } from 'react';
import api from '../api';
import { FaPlus, FaBook, FaCalendarAlt, FaUserTie } from 'react-icons/fa';

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);


  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);


  const [selectedCourseId, setSelectedCourseId] = useState('');


  const [courseForm, setCourseForm] = useState({ name: '', level: '', description: '', image: '' });
  const [lectureForm, setLectureForm] = useState({ instructorId: '', date: '' });
  const [instructorForm, setInstructorForm] = useState({ name: '', email: '', password: '' });
  const [instructorError, setInstructorError] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    try {
      const [coursesRes, instRes] = await Promise.all([
        api.get('/courses'),
        api.get('/users/instructors')
      ]);
      setCourses(coursesRes.data);
      setInstructors(instRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', courseForm);
      setShowCourseModal(false);
      setCourseForm({ name: '', level: '', description: '', image: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to add course');
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/lectures', {
        courseId: selectedCourseId,
        instructorId: lectureForm.instructorId,
        date: lectureForm.date
      });
      setShowLectureModal(false);
      setLectureForm({ instructorId: '', date: '' });
      alert('Lecture assigned successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to assign lecture');
    }
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    setInstructorError('');
    try {
      await api.post('/users', {
        name: instructorForm.name,
        email: instructorForm.email,
        password: instructorForm.password
      });
      setShowInstructorModal(false);
      setInstructorForm({ name: '', email: '', password: '' });
      fetchData();
    } catch (err) {
      setInstructorError(err.response?.data?.message || 'Error creating instructor.');
    }
  };

  return (
    <>
      <div className="glass-header" style={{ marginBottom: '3rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Console</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your academy with precision</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowInstructorModal(true)}>
              <FaUserTie /> New Instructor
            </button>
            <button className="btn btn-primary" onClick={() => setShowCourseModal(true)}>
              <FaPlus /> New Course
            </button>
          </div>
        </div>
      </div>

      <div className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
            Active Courses
          </h2>
          <div className="grid-3">
            {courses.map(course => (
              <div key={course._id} className="card" style={{ padding: 0 }}>
                {course.image && (
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={course.image}
                      alt={course.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                      <span className="badge badge-blue" style={{ backdropFilter: 'blur(8px)' }}>{course.level}</span>
                    </div>
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{course.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                    onClick={() => {
                      setSelectedCourseId(course._id);
                      setShowLectureModal(true);
                      setErrorMsg('');
                    }}
                  >
                    <FaCalendarAlt size={14} /> Schedule Batch
                  </button>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <FaBook size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              </div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Courses Yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Start by creating your first course catalog.</p>
            </div>
          )}
        </div>

        <div className="card" style={{ background: 'rgba(138, 92, 248, 0.03)', borderColor: 'rgba(138, 92, 248, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FaUserTie style={{ color: 'var(--primary)' }} /> Registered Faculty
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              {instructors.length} Members
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {instructors.map(inst => (
              <div key={inst._id} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyroot: 'center',
                  boxShadow: '0 4px 12px rgba(138, 92, 248, 0.3)'
                }}>
                  <FaUserTie size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{inst.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inst.email}</div>
                </div>
              </div>
            ))}
          </div>
          {instructors.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No instructors onboarded yet.
            </p>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaBook style={{ color: 'var(--primary)' }} /> Create Course
              </h2>
              <button className="close-btn" onClick={() => setShowCourseModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input className="form-control" required placeholder="Mastering React" value={courseForm.name} onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select className="form-control" required value={courseForm.level} onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}>
                    <option value="" disabled>Select Level...</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Brief Description</label>
                <textarea className="form-control" required placeholder="Outline the learning path..." style={{ minHeight: '100px', resize: 'none' }} value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input className="form-control" placeholder="https://..." value={courseForm.image} onChange={e => setCourseForm({ ...courseForm, image: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }}>Deploy Course Catalog</button>
            </form>
          </div>
        </div>
      )}

      {/* Assign Lecture Modal */}
      {showLectureModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Schedule Lecture</h3>
              <button className="close-btn" onClick={() => setShowLectureModal(false)}>&times;</button>
            </div>
            {errorMsg && <div style={{ background: 'var(--danger)', color: 'white', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{errorMsg}</div>}
            <form onSubmit={handleAddLecture}>
              <div className="form-group">
                <label className="form-label">Instructor</label>
                <select className="form-control" required value={lectureForm.instructorId} onChange={e => setLectureForm({ ...lectureForm, instructorId: e.target.value })}>
                  <option value="">Select Primary Faculty...</option>
                  {instructors.map(inst => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input type="date" className="form-control" required value={lectureForm.date} onChange={e => setLectureForm({ ...lectureForm, date: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Finalize Schedule</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Instructor Modal */}
      {showInstructorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Onboard Faculty</h2>
              <button className="close-btn" onClick={() => { setShowInstructorModal(false); setInstructorError(''); }}>&times;</button>
            </div>
            {instructorError && <div style={{ background: 'var(--danger)', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.5rem', color: 'white', fontSize: '0.85rem' }}>{instructorError}</div>}
            <form onSubmit={handleAddInstructor}>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input className="form-control" required placeholder="Enter Name Here" value={instructorForm.name} onChange={e => setInstructorForm({ ...instructorForm, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input type="email" className="form-control" required placeholder="Enter Email Here" value={instructorForm.email} onChange={e => setInstructorForm({ ...instructorForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" required placeholder="Enter Password Here" value={instructorForm.password} onChange={e => setInstructorForm({ ...instructorForm, password: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Authorize Account</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

