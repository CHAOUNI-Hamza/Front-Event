import React, { useEffect } from "react";
import HomeView from "../views/front/HomeView";
import LoginView from "../views/front/LoginView";
import Dashboard from "../views/back/Dashboard";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute'; // Import the PrivateRoute component
import PublicRoute from '../PublicRoute'; // Import the PublicRoute component

export default function App() {

  useEffect(() => {
    // Get the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Set request headers with the access token
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, []);

  // Axios global configuration
  //axios.defaults.baseURL = 'http://localhost:8000/api';
  axios.defaults.baseURL = 'https://events.recherche-scientifique-flshm.ma/api';
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginView />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomeView />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
