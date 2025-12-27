import React, { useState, useEffect } from 'react';

// const API_URL = 'http://localhost:8080/api/students';
const API_URL = '/api/students';


function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    enrollmentDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      setFormData({ name: '', email: '', major: '', enrollmentDate: '' });
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      major: student.major,
      enrollmentDate: student.enrollmentDate
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', major: '', enrollmentDate: '' });
    setEditingId(null);
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: '20px' }}>Đang tải...</div>
    </div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', padding: '32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', color: '#312e81', marginBottom: '32px' }}>
          🎓 Quản Lý Sinh Viên
        </h1>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            {editingId ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới'}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Ngành học
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                placeholder="Công nghệ thông tin"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Ngày nhập học
              </label>
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSubmit}
              style={{ background: '#4f46e5', color: 'white', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </button>
            
            {editingId && (
              <button
                onClick={handleCancel}
                style={{ background: '#6b7280', color: 'white', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', background: '#4f46e5' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>
              Danh sách sinh viên ({students.length})
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Họ tên</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Ngành</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Ngày nhập học</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '32px 24px', textAlign: 'center', color: '#6b7280' }}>
                      Chưa có sinh viên nào. Hãy thêm sinh viên mới!
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#111827' }}>{student.id}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{student.name}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{student.email}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{student.major || '-'}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{student.enrollmentDate || '-'}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                        <button
                          onClick={() => handleEdit(student)}
                          style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px' }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;