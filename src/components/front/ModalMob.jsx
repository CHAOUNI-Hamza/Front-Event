import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Swal from 'sweetalert2';
import axios from 'axios';

import '../../css/modal.css';

const theme = createTheme({
  direction: 'rtl',
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalAct({ open, handleClose, setShowAlert }) {
  const [formData, setFormData] = React.useState({
    first_name_benefit: '',
    last_name_benefit: '',
    date_go: '',
    date_return: '',
    destination: '',
    laboratory: '',
    department: '',
    status: 'encours',
  });

  const [formErrors, setFormErrors] = React.useState({
    first_name_benefit: '',
    last_name_benefit: '',
    date_go: '',
    date_return: '',
    destination: '',
    laboratory: '',
    department: '',
  });

  const [nbrDay, setNbrDay] = React.useState(null); // State for nbr_day

  React.useEffect(() => {
    fetchData(); // Fetch nbr_day on component mount
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/constraineds/1');
      setNbrDay(parseInt(response.data.data.nbr_day)); // Parse and set nbr_day
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const clearForm = () => {
    setFormData({
      first_name_benefit: '',
      last_name_benefit: '',
      date_go: '',
      date_return: '',
      destination: '',
      laboratory: '',
      department: '',
      status: 'encours',
    });
    setFormErrors({
      first_name_benefit: '',
      last_name_benefit: '',
      date_go: '',
      date_return: '',
      destination: '',
      laboratory: '',
      department: '',
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' }); // Clear error when input changes
  };

  const handleCloseModal = () => {
    handleClose(); // Close the modal
    clearForm(); // Clear form fields
  };

  const validateDateGo = (date) => {
    if (nbrDay === null) {
      return true; // Handle case where nbrDay hasn't been fetched yet (or is null)
    }
    const today = new Date();
    const selectedDate = new Date(date);
    const minDate = new Date(today.getTime() + nbrDay * 24 * 60 * 60 * 1000); // Use nbrDay fetched from API

    return selectedDate >= minDate;
  };

  const handleValidation = () => {
    let valid = true;
    const newErrors = { ...formErrors };

    for (const field in formData) {
      if (formData[field].trim() === '' && field !== 'type' && field !== 'status') {
        newErrors[field] = 'يجب ملء هذا الحقل';
        valid = false;
      } else {
        newErrors[field] = '';
      }
    }

    if (!validateDateGo(formData.date_go)) {
      newErrors['date_go'] = `يرجى تحديد تاريخ بعد ${nbrDay} يوماً من اليوم`;
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      try {
        const response = await axios.post('/mobilitys', formData);

        console.log('تم تسجيل طلبك بنجاح', response.data);
        handleClose();
        clearForm();
        setShowAlert(true);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "تم تسجيل طلبك بنجاح"
        });

      } catch (error) {
        if (error.response && error.response.status === 422) {
          console.error('Validation error:', error.response.data);
          setFormErrors({ ...formErrors, date_go: error.response.data.errorDate });
        } else {
          console.error('There was a problem with the Axios request:', error);
        }
      }
    } else {
      console.log('Form has errors. Cannot submit.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ direction: 'rtl' }}>
        <Modal
          onClose={handleCloseModal} // Call handleCloseModal instead of handleClose
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography color="#5f9ea0" className="font-arabic" style={{ marginBottom: '15px' }} id="modal-modal-title" variant="h6" component="h2">
            طلب السفر الى الخارج
            </Typography>
            <form onSubmit={handleSubmit}>
              {['first_name_benefit', 'last_name_benefit', 'date_go', 'date_return', 'destination', 'laboratory', 'department'].map((field, index) => (
                <Box key={index} sx={{ mb: 0 }}>
                  <label className="font-arabic" htmlFor={field} style={{ display: 'block', textAlign: 'right' }}>
                    {['الإسم الشخصي للمستفيد', 'الإسم العائلي للمستفيد', 'تاريخ الذهاب', 'تاريخ العودة', 'الوجهة', 'المختبر', 'الشعبة'][index]}
                  </label>
                  <TextField
                    placeholder={['أدخل الإسم الشخصي', 'أدخل الإسم العائلي', 'تاريخ الذهاب', 'تاريخ العودة', 'أدخل الوجهة', 'أدخل اسم المختبر', 'أدخل اسم الشعبة'][index]}
                    id={field}
                    name={field}
                    type={field.includes('date') ? 'date' : 'text'} // Setting type to date for date fields
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData[field]}
                    inputProps={{ dir: 'rtl' }}
                    onChange={handleChange}
                    error={Boolean(formErrors[field])}
                    helperText={formErrors[field]}
                  />
                </Box>
              ))}
              <Button onClick={handleCloseModal} variant="contained" type="submit">
                <Typography className="font-arabic" color="white">
                إغلاق
                </Typography>
              </Button>
              <Button style={{ marginLeft: '5px', backgroundColor: 'green' }} variant="contained" type="submit">
                <Typography className="font-arabic" color="white">
                  إرسال
                </Typography>
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}
