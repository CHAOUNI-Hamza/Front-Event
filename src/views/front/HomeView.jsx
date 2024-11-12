import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '../../components/front/Tabs';
import ModalAct from '../../components/front/ModalAct';
import axios from 'axios';
import coverHeader from '../../assets/cover-header-avec-logo-40ans-05.jpg';
import logoProfile from '../../assets/logo-profile.png';
import '../../css/home.css';

export default function HomeView() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post('/auth/me');
        setUserName(response.data.data.name.toUpperCase());
        setUserRole(response.data.data.role);
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box component="section">
        <img className="mt-5" src={coverHeader} alt="Cover Header" width="100%" />
      </Box>
      <div className="profile">
        <img src={logoProfile} width={50} alt="Logo Profile" />
        <h3 className="font-francais mt-3">{userName}</h3>
      </div>
      <Tabs userRole={userRole} />
      <ModalAct />
    </Container>
  );
}
