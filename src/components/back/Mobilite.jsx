import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function formatDate(dateString) {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
}

function Mobilite() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [newUserData, setNewUserData] = useState({
        first_name_benefit: '',
        last_name_benefit: '',
        date_go: '',
        date_return: '',
        status: '',
        destination: '',
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
            const response = await axios.get('/mobilitys', {
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
        const { first_name_benefit, last_name_benefit, date_go, date_return, status, destination, laboratory, department } = newUserData;
        if (!first_name_benefit || !last_name_benefit || !date_go || !date_return || !status || !destination || !laboratory || !department) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'يرجى ملء جميع الحقول المطلوبة!',
            });
            return;
        }
        try {
            await axios.post('/mobilitys', { first_name_benefit, last_name_benefit, date_go, date_return, status, destination, laboratory, department });
            fetchData();
            setNewUserData({
                first_name_benefit: '',
                last_name_benefit: '',
                date_go: '',
                date_return: '',
                status: '',
                destination: '',
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
            const { id, first_name_benefit, last_name_benefit, date_go, date_return, status, destination, laboratory, department } = editUserData;
            await axios.put(`/mobilitys/${id}`, { first_name_benefit, last_name_benefit, date_go, date_return, status, destination, laboratory, department });
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
                await axios.delete(`/mobilitys/${id}`);
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
                        <h3 className="card-title" style={{ float: 'right' }}> طلبات السفر</h3>
                        <div className="card-tools" style={{ marginRight: '10rem' }}>
                            <div className="input-group input-group-sm" style={{ width: '214px' }}>
                                <input
                                    type="text"
                                    name="table_search"
                                    className="form-control float-right search-input"
                                    placeholder="البحث بالنسب"
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
                                    <th>الوجهة</th>
                                    <th>تاريخ العودة</th>
                                    <th>تاريخ الذهاب</th>
                                    <th>نسب المستفيد</th>
                                    <th>إسم المستفيد</th>
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
                                        <td>{user.destination}</td>
                                        <td>{formatDate(user.date_return)}</td>
                                        <td>{formatDate(user.date_go)}</td>
                                        <td>{user.last_name_benefit}</td>
                                        <td>{user.first_name_benefit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer clearfix">
                        <ul className="pagination pagination-sm m-0 float-left">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</a>
                            </li>
                            {[...Array(lastPage)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Modal for adding user */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header" dir='rtl'>
                            <h5 className="modal-title text-left" id="exampleModalLabel">إضافة طلب جديد</h5>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group text-right">
                                    <label htmlFor="first_name_benefit">إسم المستفيد</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name_benefit"
                                        name="first_name_benefit"
                                        value={newUserData.first_name_benefit}
                                        onChange={handleNewUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="last_name_benefit">نسب المستفيد</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name_benefit"
                                        name="last_name_benefit"
                                        value={newUserData.last_name_benefit}
                                        onChange={handleNewUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="date_go">تاريخ الذهاب</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="date_go"
                                        name="date_go"
                                        value={newUserData.date_go}
                                        onChange={handleNewUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="date_return">تاريخ العودة</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="date_return"
                                        name="date_return"
                                        value={newUserData.date_return}
                                        onChange={handleNewUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="status">الحالة</label>
                                    <select
                                        className="form-control"
                                        id="status"
                                        name="status"
                                        value={newUserData.status}
                                        onChange={handleNewUserDataChange}
                                    >
                                        <option value="">اختيار الحالة</option>
                                        <option value="encours">جاري</option>
                                        <option value="valider">مقبول</option>
                                        <option value="novalider">مرفوض</option>
                                    </select>
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="destination">الوجهة</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="destination"
                                        name="destination"
                                        value={newUserData.destination}
                                        onChange={handleNewUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="laboratory">المختبر</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="laboratory"
                                        name="laboratory"
                                        value={newUserData.laboratory}
                                        onChange={handleNewUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="department">الشعبة</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="department"
                                        name="department"
                                        value={newUserData.department}
                                        onChange={handleNewUserDataChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">إغلاق</button>
                            <button type="button" className="btn btn-primary" onClick={addUser}>إضافة</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for editing user */}
            <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">تعديل معلومات النشاط</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="closeEditModalBtn">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_first_name_benefit">إسم المستفيد</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edit_first_name_benefit"
                                        name="first_name_benefit"
                                        value={editUserData?.first_name_benefit || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_last_name_benefit">نسب المستفيد</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edit_last_name_benefit"
                                        name="last_name_benefit"
                                        value={editUserData?.last_name_benefit || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_date_go">تاريخ الذهاب</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="edit_date_go"
                                        name="date_go"
                                        value={editUserData?.date_go || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_date_return">تاريخ العودة</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="edit_date_return"
                                        name="date_return"
                                        value={editUserData?.date_return || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_status">الحالة</label>
                                    <select
                                        className="form-control"
                                        id="edit_status"
                                        name="status"
                                        value={editUserData?.status || ''}
                                        onChange={handleEditUserDataChange}
                                    >
                                        <option value="">اختيار الحالة</option>
                                        <option value="encours">جاري</option>
                                        <option value="valider">مقبول</option>
                                        <option value="novalider">مرفوض</option>
                                    </select>
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_destination">الوجهة</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edit_destination"
                                        name="destination"
                                        value={editUserData?.destination || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_laboratory">المختبر</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edit_laboratory"
                                        name="laboratory"
                                        value={editUserData?.laboratory || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="edit_department">الشعبة</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edit_department"
                                        name="department"
                                        value={editUserData?.department || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">إغلاق</button>
                            <button type="button" className="btn btn-primary" onClick={editUser}>حفظ التعديلات</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mobilite;

