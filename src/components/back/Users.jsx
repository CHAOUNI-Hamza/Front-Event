import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [newUserData, setNewUserData] = useState({
    name: '',
    role: 'user',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [editUserData, setEditUserData] = useState(null);
  const [editPasswordData, setEditPasswordData] = useState({
    id: null,
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    fetchData();
  }, [search, currentPage]);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/users', {
        params: { search, page: currentPage }
      });
      setUsers(response.data.data);
      setLastPage(response.data.meta.last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
      //setError('حدث خطأ أثناء جلب البيانات.');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const handleEditPasswordDataChange = (e) => {
    const { name, value } = e.target;
    setEditPasswordData({ ...editPasswordData, [name]: value });
  };

  const addUser = async () => {
    const { name, role, email, password, confirmPassword } = newUserData;
    if (!name || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'كلمة المرور وتأكيد كلمة المرور غير متطابقين!',
      });
      return;
    }
    try {
      await axios.post('/users', { name, role, email, password });
      fetchData();
      setNewUserData({
        name: '',
        role: 'user',
        email: '',
        password: '',
        confirmPassword: ''
      });
      Swal.fire({
        title: "تم",
        text: "تمت إضافة مستخدم جديد بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
    } catch (error) {
      console.error('Error adding user:', error);
      setError('حدث خطأ أثناء إضافة المستخدم.');
    }
  };

  const editUser = async () => {
    try {
      const { id, name, email, role } = editUserData;
      await axios.put(`/users/${id}`, { name, email, role });
      fetchData();
      Swal.fire({
        title: "تم",
        text: "تم تحديث معلومات المستخدم بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setError('حدث خطأ أثناء تحديث معلومات المستخدم.');
    }
  };

  const editPassword = async () => {
    const { id, newPassword, confirmNewPassword } = editPasswordData;
    if (!newPassword || !confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى إدخال كلمة مرور جديدة وتأكيد كلمة المرور!',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين!',
      });
      return;
    }
    try {
      await axios.put(`/users/${id}`, { password: newPassword });
      fetchData();
      Swal.fire({
        title: "تم",
        text: "تم تحديث كلمة المرور بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closePasswordModalBtn').click();
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setError('حدث خطأ أثناء تحديث كلمة المرور.');
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفها!"
      });

      if (result.isConfirmed) {
        await axios.delete(`/users/${id}`);
        fetchData();
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف المستخدم بنجاح.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('حدث خطأ أثناء حذف المستخدم.');
    }
  };

  const openEditModal = (user) => {
    setEditUserData(user);
  };

  const openPasswordModal = (user) => {
    setEditPasswordData({
      id: user.id,
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  return (
    <div className="row font-arabic">
      <div className="col-12">
        <button
          type="button"
          data-toggle="modal"
          data-target="#exampleModal"
          className="btn btn-success btn-flat mb-3"
          aria-label="إضافة"
          style={{ padding: '3px 11px' }}
        >
          <i className="fa fa-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
          إضافة
        </button>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ float: 'right' }}>لائحة المستخدمين</h3>
            <div className="card-tools" style={{ marginRight: '10rem' }}>
              <div className="input-group input-group-sm" style={{ width: '214px' }}>
                <input
                  type="text"
                  name="table_search"
                  className="form-control float-right search-input"
                  placeholder="البحث"
                  style={{ textAlign: 'right' }}
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr style={{ textAlign: 'right' }}>
                  <th>إجراءات</th>
                  <th>الدور</th>
                  <th>البريد الإلكتروني</th>
                  <th>الإسم و النسب</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ textAlign: 'right' }}>
                    <td>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
                      <a
                        href="#"
                        style={{ color: '#28a745' }}
                        aria-label="Change Password"
                        onClick={() => openPasswordModal(user)}
                        data-toggle="modal"
                        data-target="#passwordModal"
                      >
                        <i className="fa fa-key" aria-hidden="true"></i>
                      </a>
                    </td>
                    <td style={{ color: user.role === 'admin' ? 'green' : 'blue' }}>
                      {user.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
          <div className="card-footer clearfix">
            <ul className="pagination pagination-sm m-0 float-right">
              {Array.from({ length: lastPage }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title" id="exampleModalLabel">إضافة مستخدم جديد</h5>
            
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group tex-right">
                  <label htmlFor="name" style={{ float: 'right' }}>الإسم و النسب</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newUserData.name}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="role" style={{ float: 'right' }}>الدور</label>
                  <select
                    className="form-control"
                    id="role"
                    name="role"
                    value={newUserData.role}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="user">مستخدم</option>
                    <option value="admin">مسؤول</option>
                  </select>
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="email" style={{ float: 'right' }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="password" style={{ float: 'right' }}>كلمة المرور</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={newUserData.password}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="confirmPassword" style={{ float: 'right' }}>تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={newUserData.confirmPassword}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" id="closeModalBtn">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>إضافة</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header"  dir='rtl'>
              <h5 className="modal-title" id="editModalLabel">تعديل معلومات المستخدم</h5>
            </div>
            <div className="modal-body">
              {editUserData && (
                <form>
                  <div className="form-group tex-right">
                    <label htmlFor="editName" style={{ float: 'right' }}>الإسم و النسب</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editName"
                      name="name"
                      value={editUserData.name}
                      onChange={handleEditUserDataChange}
                      required
                    />
                  </div>
                  <div className="form-group tex-right">
                    <label htmlFor="editRole" style={{ float: 'right' }}>الدور</label>
                    <select
                      className="form-control"
                      id="editRole"
                      name="role"
                      value={editUserData.role}
                      onChange={handleEditUserDataChange}
                      required
                    >
                      <option value="user">مستخدم</option>
                      <option value="admin">مسؤول</option>
                    </select>
                  </div>
                  <div className="form-group tex-right">
                    <label htmlFor="editEmail" style={{ float: 'right' }}>البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="form-control"
                      id="editEmail"
                      name="email"
                      value={editUserData.email}
                      onChange={handleEditUserDataChange}
                      required
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" id="closeEditModalBtn">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={editUser}>تحديث</button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div className="modal fade" id="passwordModal" tabIndex="-1" role="dialog" aria-labelledby="passwordModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title" id="passwordModalLabel">تغيير كلمة المرور</h5>

            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="newPassword" style={{ float: 'right' }}>كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={editPasswordData.newPassword}
                    onChange={handleEditPasswordDataChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmNewPassword" style={{ float: 'right' }}>تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={editPasswordData.confirmNewPassword}
                    onChange={handleEditPasswordDataChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" id="closePasswordModalBtn">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={editPassword}>تغيير</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
