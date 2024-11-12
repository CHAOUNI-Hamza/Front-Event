import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';


function NmJour() {
    const [userData, setUserData] = useState(null);
    const [editUserData, setEditUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setError(null);
        try {
            const response = await axios.get('/constraineds/1');
            setUserData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('حدث خطأ أثناء جلب البيانات.');
        }
    };

    const handleEditUserDataChange = (e) => {
        const { name, value } = e.target;
        setEditUserData({ ...editUserData, [name]: value });
    };

    const editUser = async () => {
        try {
            const { id, nbr_day } = editUserData;
            await axios.put(`/constraineds/${id}`, { nbr_day });
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

    const openEditModal = (user) => {
        setEditUserData(user);
    };

    if (!userData) return null;

    return (
        <div className="row font-arabic">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ float: 'right' }}> عدد أيام المحددة للطلبات</h3>
                    </div>
                    <div className="card-body table-responsive p-0">
                        <table className="table table-hover text-nowrap">
                            <thead>
                                <tr style={{ textAlign: 'right' }}>
                                    <th>إجراءات</th>
                                    <th>عدد الأيام</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={userData.id} style={{ textAlign: 'right' }}>
                                    <td>
                                        <a
                                            type='button'
                                            data-toggle="modal"
                                            data-target="#editModal"
                                            style={{ color: '#007bff', marginRight: '10px' }}
                                            aria-label="Edit"
                                            onClick={() => openEditModal(userData)}
                                        >
                                            <i className="fa fa-edit" aria-hidden="true"></i>
                                        </a>
                                    </td>
                                    <td>{userData.nbr_day}</td>
                                </tr>
                            </tbody>
                        </table>
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
                                <div className="form-group">
                                    <label htmlFor="edit_nbr_day">عدد الأيام</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edit_nbr_day"
                                        name="nbr_day"
                                        value={editUserData?.nbr_day || ''}
                                        onChange={handleEditUserDataChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">إلغاء</button>
                            <button type="button" className="btn btn-primary" onClick={editUser}>حفظ التعديلات</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NmJour;
