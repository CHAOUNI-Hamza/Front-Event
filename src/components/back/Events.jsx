import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function formatDate(dateString) {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  }

function Events() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [newUserData, setNewUserData] = useState({
    title: '',
    date: '',
    duration: '',
    place: '',
    type: '',
    status: '',
    coordinator: '',
    laboratory: '',
    department: ''
  });
  const [editUserData, setEditUserData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [search, currentPage]);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/events', {
        params: { search, page: currentPage }
      });
      setUsers(response.data.data);
      setLastPage(response.data.meta.last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('حدث خطأ أثناء جلب البيانات.');
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

  const addUser = async () => {
    const { title, date, duration, place, type, status, coordinator, laboratory, department } = newUserData;
    if (!title || !date || !duration || !place || !type || !status || !coordinator || !laboratory || !department) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('/events', { title, date, duration, place, type, status, coordinator, laboratory, department });
      fetchData();
      setNewUserData({
        title: '',
        date: '',
        duration: '',
        place: '',
        type: '',
        status: '',
        coordinator: '',
        laboratory: '',
        department: ''
      });
      Swal.fire({
        title: "تم",
        text: "تمت إضافة النشاط الجديد بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
    } catch (error) {
      if (error.response && error.response.data.errorDate) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: error.response.data.errorDate,
        });
      } else {
        console.error('Error adding user:', error);
        setError('حدث خطأ أثناء إضافة النشاط.');
      }
    }
  };
  

  const editUser = async () => {
    try {
      const { id, title, date, duration, place, type, status, coordinator, laboratory, department } = editUserData;
      await axios.put(`/events/${id}`, { title, date, duration, place, type, status, coordinator, laboratory, department });
      fetchData();
      Swal.fire({
        title: "تم",
        text: "تم تحديث معلومات النشاط بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
        if (error.response && error.response.data.errorDate) {
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: error.response.data.errorDate,
            });
          } else {
            console.error('Error updating user:', error);
            setError('حدث خطأ أثناء تحديث معلومات النشاط.');
          }
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
        await axios.delete(`/events/${id}`);
        fetchData();
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف النشاط بنجاح.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('حدث خطأ أثناء حذف النشاط.');
    }
  };

  const openEditModal = (user) => {
    setEditUserData(user);
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
            <h3 className="card-title" style={{ float: 'right' }}>لائحة الأنشطة</h3>
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
                  <th>الحالة</th>
                  <th>الشعبة</th>
                  <th>المختبر</th>
                  <th>المنسق</th>
                  <th>القاعة / المدرج</th>
                  <th>مدة النشاط</th>
                  <th>تاريخ التنظيم</th>
                  <th>العنوان</th>
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
                    </td>
                    <td style={{ color: user.status === 'valider' ? 'green' : user.status === 'novalider' ? 'red' : 'orange' }}>
                    {user.status === 'encours' ? 'جاري' :
                       user.status === 'valider' ? 'مقبول' :
                       user.status === 'novalider' ? 'مرفوض' : ''}
                    </td>
                    <td>{user.department}</td>
                    <td>{user.laboratory}</td>
                    <td>{user.coordinator}</td>
                    <td>
                    {user.place === 'amphie-fatima-mernissi' && <span className="text-right">قاعة فاطمة المرنيسي</span>}
                    {user.place === 'amphie-fatima-fihriya' && <span className="text-right">مدرج فاطمة الفهرية</span>}
                    {user.place === 'amphie-imame-malik' && <span className="text-right">مدرج الإمام مالك</span>}
                    {user.place === 'amphie-youssi' && <span className="text-right">مدرج اليوسي</span>}
                    {user.place === 'autre' && <span className="text-right">آخر</span>}
                    </td>
                    <td>{user.duration} H</td>
                    <td>{formatDate(user.date)}</td>
                    <td>{user.title}</td>
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
              <h5 className="modal-title" id="exampleModalLabel">إضافة نشاط</h5>
            </div>
            <div className="modal-body" dir='rtl'>
              <form>
                <div className="form-group text-right">
                  <label htmlFor="title">العنوان</label>
                  <input type="text" className="form-control" id="title" name="title" value={newUserData.title} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date">تاريخ التنظيم</label>
                  <input type="date" className="form-control" id="date" name="date" value={newUserData.date} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="duration">مدة النشاط</label>
                  <input type="number" className="form-control" id="duration" name="duration" value={newUserData.duration} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="place">القاعة / المدرج</label>
                  <select
                      className="form-control"
                      id="place"
                      name="place"
                      value={newUserData.place}
                      onChange={handleNewUserDataChange}
                      required
                    >
                        <option value="">اختر القاعة / المدرج</option>
                      <option value="amphie-fatima-fihriya">مدرج فاطمة الفهرية</option>
                      <option value="amphie-imame-malik">مدرج الإمام مالك</option>
                      <option value="amphie-youssi">مدرج اليوسي</option>
                      <option value="amphie-fatima-mernissi">قاعة فاطمة المرنيسي</option>
                      <option value="autre">آخر</option>
                    </select>
                </div>
                <div className="form-group text-right">
                  <label htmlFor="type">نوع النشاط</label>
                  <select
                      className="form-control"
                      id="type"
                      name="type"
                      value={newUserData.type}
                      onChange={handleNewUserDataChange}
                      required
                    >
                        <option value="">اختر نوع النشاط </option>
                      <option value="scientifique">علمي</option>
                      <option value="culturelle">ثقافي</option>
                      <option value="autre">آخر</option>
                    </select>
                </div>
                <div className="form-group text-right">
                  <label htmlFor="status">الحالة</label>
                  <select
                      className="form-control"
                      id="status"
                      name="status"
                      value={newUserData.status}
                      onChange={handleNewUserDataChange}
                      required
                    >
                        <option value="">اختر الحالة  </option>
                        <option value="valider">مقبول</option>
                      <option value="novalider">مرفوض</option>
                      <option value="encours">جاري</option>
                    </select>
                </div>
                <div className="form-group text-right">
                  <label htmlFor="coordinator">المنسق</label>
                  <input type="text" className="form-control" id="coordinator" name="coordinator" value={newUserData.coordinator} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="laboratory">المختبر</label>
                  <input type="text" className="form-control" id="laboratory" name="laboratory" value={newUserData.laboratory} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="department">الشعبة</label>
                  <input type="text" className="form-control" id="department" name="department" value={newUserData.department} onChange={handleNewUserDataChange} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>إضافة</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {/* Edit User Modal */}
{editUserData && (
  <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header" dir='rtl'>
          <h5 className="modal-title" id="editModalLabel">تعديل النشاط</h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
            <div className="form-group text-right">
              <label htmlFor="title">العنوان</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={editUserData.title}
                onChange={handleEditUserDataChange}
                required
              />
            </div>
            <div className="form-group text-right">
              <label htmlFor="date">تاريخ التنظيم</label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={editUserData.date}
                onChange={handleEditUserDataChange}
                required
              />
            </div>
            <div className="form-group text-right">
              <label htmlFor="duration">مدة النشاط</label>
              <input
                type="number"
                className="form-control"
                id="duration"
                name="duration"
                value={editUserData.duration}
                onChange={handleEditUserDataChange}
                required
              />
            </div>
            <div className="form-group text-right">
              <label htmlFor="place">القاعة / المدرج</label>
              <select
                className="form-control"
                id="place"
                name="place"
                value={editUserData.place}
                onChange={handleEditUserDataChange}
                required
              >
                <option value="">اختر القاعة / المدرج</option>
                <option value="amphie-fatima-fihriya" selected={editUserData.place === "amphie-fatima-fihriya"}>مدرج فاطمة الفهرية</option>
                <option value="amphie-imame-malik" selected={editUserData.place === "amphie-imame-malik"}>مدرج الإمام مالك</option>
                <option value="amphie-youssi" selected={editUserData.place === "amphie-youssi"}>مدرج اليوسي</option>
                <option value="amphie-fatima-mernissi" selected={editUserData.place === "amphie-fatima-mernissi"}>قاعة فاطمة المرنيسي</option>
                <option value="autre" selected={editUserData.place === "autre"}>آخر</option>
              </select>
            </div>
            <div className="form-group text-right">
              <label htmlFor="type">نوع النشاط</label>
              <select
                className="form-control"
                id="type"
                name="type"
                value={editUserData.type}
                onChange={handleEditUserDataChange}
                required
              >
                <option value="">اختر نوع النشاط</option>
                <option value="scientifique" selected={editUserData.type === "scientifique"}>علمي</option>
                <option value="culturelle" selected={editUserData.type === "culturelle"}>ثقافي</option>
                <option value="autre" selected={editUserData.type === "autre"}>آخر</option>
              </select>
            </div>
            <div className="form-group text-right">
              <label htmlFor="status">الحالة</label>
              <select
                className="form-control"
                id="status"
                name="status"
                value={editUserData.status}
                onChange={handleEditUserDataChange}
                required
              >
                <option value="">اختر الحالة</option>
                <option value="valider" selected={editUserData.status === "valider"}>مقبول</option>
                <option value="novalider" selected={editUserData.status === "novalider"}>مرفوض</option>
                <option value="encours" selected={editUserData.status === "encours"}>جاري</option>
              </select>
            </div>
            <div className="form-group text-right">
              <label htmlFor="coordinator">المنسق</label>
              <input
                type="text"
                className="form-control"
                id="coordinator"
                name="coordinator"
                value={editUserData.coordinator}
                onChange={handleEditUserDataChange}
                required
              />
            </div>
            <div className="form-group text-right">
              <label htmlFor="laboratory">المختبر</label>
              <input
                type="text"
                className="form-control"
                id="laboratory"
                name="laboratory"
                value={editUserData.laboratory}
                onChange={handleEditUserDataChange}
                required
              />
            </div>
            <div className="form-group text-right">
              <label htmlFor="department">الشعبة</label>
              <input
                type="text"
                className="form-control"
                id="department"
                name="department"
                value={editUserData.department}
                onChange={handleEditUserDataChange}
                required
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" id="closeEditModalBtn" data-dismiss="modal">إلغاء</button>
          <button type="button" className="btn btn-primary" onClick={editUser}>تعديل</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Events;
