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
  const [instructorForm, setInstructorForm] = useState({ name: '' });
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
      await api.post('/users', { name: instructorForm.name });
      setShowInstructorModal(false);
      setInstructorForm({ name: '' });
      fetchData();
    } catch (err) {
      setInstructorError(err.response?.data?.message || 'Error creating instructor.');
    }
  };

  return (
    <>
      <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowInstructorModal(true)}>
            <FaUserTie /> Add Instructor
          </button>
          <button className="btn btn-primary" onClick={() => setShowCourseModal(true)}>
            <FaPlus /> Add Course
          </button>
        </div>
      </div>

      <div className="grid-3">
        {courses.map(course => (
          <div key={course._id} className="card">
            {course.image && <img src={course.image} alt={course.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', marginBottom: '1rem' }} />}
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaBook /> {course.name}</h3>
            <span className="badge badge-blue" style={{ marginBottom: '1rem', display: 'inline-block' }}>{course.level}</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px' }}>{course.description}</p>
            
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%' }}
              onClick={() => {
                setSelectedCourseId(course._id);
                setShowLectureModal(true);
                setErrorMsg('');
              }}
            >
              <FaCalendarAlt /> Assign Lecture (Batch)
            </button>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <FaBook size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No Courses Found</h3>
          <p>Get started by adding a new course.</p>
        </div>
      )}
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FaUserTie /> Registered Instructors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {instructors.map(inst => (
            <div key={inst._id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}><FaUserTie size={14} /></div>
              <span style={{ fontWeight: 600 }}>{inst.name}</span>
            </div>
          ))}
          {instructors.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No instructors yet. Click "Add Instructor" to begin.</p>}
        </div>
      </div>

      </div>
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
                <FaBook /> Create New Course
              </h3>
              <button className="close-btn" onClick={() => setShowCourseModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Course Name</label>
                  <input className="form-control" required placeholder="e.g. Master React" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select className="form-control" required value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})}>
                    <option value="" disabled>Select Level...</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" required placeholder="What will students learn?" style={{ minHeight: '120px', resize: 'vertical' }} value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input className="form-control" placeholder="https://example.com/image.jpg" value={courseForm.image} onChange={e => setCourseForm({...courseForm, image: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.05rem' }}>Create Course</button>
            </form>
          </div>
        </div>
      )}

      {showLectureModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3>Assign Lecture</h3>
              <button className="close-btn" onClick={() => setShowLectureModal(false)}>&times;</button>
            </div>
            {errorMsg && <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>{errorMsg}</div>}
            <form onSubmit={handleAddLecture}>
              <div className="form-group">
                <label className="form-label">Instructor</label>
                <select className="form-control" required value={lectureForm.instructorId} onChange={e => setLectureForm({...lectureForm, instructorId: e.target.value})}>
                  <option value="">Select Instructor...</option>
                  {instructors.map(inst => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" required value={lectureForm.date} onChange={e => setLectureForm({...lectureForm, date: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Schedule Lecture</button>
            </form>
          </div>
        </div>
      )}

      {showInstructorModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3>Add New Instructor</h3>
              <button className="close-btn" onClick={() => { setShowInstructorModal(false); setInstructorError(''); }}>&times;</button>
            </div>
            {instructorError && <div style={{ background: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: 'white' }}>{instructorError}</div>}
            <form onSubmit={handleAddInstructor}>
              <div className="form-group">
                <label className="form-label">Instructor Name</label>
                <input className="form-control" required placeholder="e.g. Rahul Sharma" value={instructorForm.name} onChange={e => setInstructorForm({...instructorForm, name: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Instructor</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
