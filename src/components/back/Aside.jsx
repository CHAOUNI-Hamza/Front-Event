import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Aside({ setActiveComponent, activeComponent }) {

    const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post('/auth/me');
        setUserName(response.data.data.name.toUpperCase());
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
      }
    };

    fetchUser();
  }, []);

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a href="index3.html" className="brand-link" style={{ textAlign: 'center' }}>
                <span className="brand-text font-weight-light">FLSHM</span>
            </a>

            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <a type='button' className="d-block">{userName}</a>
                    </div>
                </div>

                {/*<div className="form-inline">
                    <div className="input-group" data-widget="sidebar-search">
                        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                        <div className="input-group-append">
                            <button className="btn btn-sidebar">
                                <i className="fas fa-search fa-fw"></i>
                            </button>
                        </div>
                    </div>
    </div>*/}

                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item menu-open">
                            <a href="#" className={`nav-link ${activeComponent === "Dashboard" ? "active" : ""}`} onClick={() => setActiveComponent("Dashboard")}>
                                <i className="nav-icon fas fa-tachometer-alt"></i>
                                <p>
                                    Pages de démarrage
                                    <i className="right fas fa-angle-left"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <a href="#" className={`nav-link ${activeComponent === "Users" ? "active" : ""}`} onClick={() => setActiveComponent("Users")}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Utilisateurs</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className={`nav-link ${activeComponent === "Events" ? "active" : ""}`} onClick={() => setActiveComponent("Events")}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Événement</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className={`nav-link ${activeComponent === "Calendrier" ? "active" : ""}`} onClick={() => setActiveComponent("Calendrier")}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Calendrier</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className={`nav-link ${activeComponent === "Mobilite" ? "active" : ""}`} onClick={() => setActiveComponent("Mobilite")}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Mobilité</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className={`nav-link ${activeComponent === "NmJour" ? "active" : ""}`} onClick={() => setActiveComponent("NmJour")}>
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Nombre de jours</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Aside;
