import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../assets/logo-fac.png';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/login.css';

const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Droits d\'auteur © '}
      <Link color="inherit" href="https://flshm.ma/">
        Votre site web
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

export default function SignIn() {
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  //const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');


    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Adresse email invalide');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Le mot de passe doit comporter au moins 6 caractères');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      try {
        const response = await axios.post(`/auth/login`, {
          email: email,
          password: password,
        });


        const { access_token, role_auth } = response.data;
        localStorage.setItem('accessToken', access_token);

        window.location.href = '/';

        /*if (roleAuth === 'admin') {
          navigate('/'); 
        } else {
          window.location.href = '/'; 
        }*/

      } catch (error) {
        console.error('Erreur :', error);
        setAuthError('Email ou mot de passe incorrect');
      }
    }
  };

  return (
    <ThemeProvider className='login' theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" width="80%" />
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              className='font-francais input-email'
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!emailError}
            />
            {emailError && (
                <Typography className='font-francais' variant="body2" color="error" gutterBottom>
                  {emailError}
                </Typography>
              )}
            <TextField
              margin="normal"
              className='font-francais'
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!passwordError}
            />
            {passwordError && (
                <Typography className='font-francais' variant="body2" color="error" gutterBottom>
                  {passwordError}
                </Typography>
              )}
            {authError && (
              <Typography className='font-francais' variant="body2" color="error" align="center" gutterBottom>
                {authError}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se Connecter
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
