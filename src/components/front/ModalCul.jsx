import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Swal from 'sweetalert2';

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

const selectOptions = [
  { value: 'amphie-fatima-mernissi', label: 'قاعة فاطمة المرنيسي' },
  { value: 'amphie-fatima-fihriya', label: 'مدرج فاطمة الفهرية' },
  { value: 'amphie-imame-malik', label: 'مدرج الإمام مالك' },
  { value: 'amphie-youssi', label: 'مدرج اليوسي' },
  { value: 'autre', label: 'آخر' },
];

const ModalAct = ({ open, handleClose, setShowAlert }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    duration: '',
    coordinator: '',
    laboratory: '',
    department: '',
    place: '',
    date: '',
    type: 'culturelle',
    status: 'encours',
  });

  const [formErrors, setFormErrors] = React.useState({
    title: '',
    duration: '',
    coordinator: '',
    laboratory: '',
    department: '',
    place: '',
    date: '',
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

  const isDateValid = (selectedDate) => {
    if (nbrDay === null) {
      return true; // Handle case where nbrDay hasn't been fetched yet (or is null)
    }
    const currentDate = new Date();
    const minDate = new Date();
    minDate.setDate(currentDate.getDate() + nbrDay); // Use nbrDay fetched from API
    return selectedDate >= minDate;
  };

  const clearForm = () => {
    setFormData({
      title: '',
      duration: '',
      coordinator: '',
      laboratory: '',
      department: '',
      place: '',
      date: '',
      type: 'culturelle',
      status: 'encours',
    });
    setFormErrors({
      title: '',
      duration: '',
      coordinator: '',
      laboratory: '',
      department: '',
      place: '',
      date: '',
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'date') {
      const selectedDate = new Date(value);
      if (!isDateValid(selectedDate)) {
        setFormErrors({ ...formErrors, [name]: `يرجى تحديد تاريخ بعد ${nbrDay} يوماً من اليوم` });
      } else {
        setFormErrors({ ...formErrors, [name]: '' });
      }
    } else {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleCloseModal = () => {
    handleClose(); // Close the modal
    clearForm(); // Clear form fields
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

    const selectedDate = new Date(formData.date);
    if (nbrDay !== null && !isDateValid(selectedDate)) {
      newErrors.date = `يرجى تحديد تاريخ بعد ${nbrDay} يوماً من اليوم`;
      valid = false;
    } else {
      newErrors.date = '';
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      try {
        const response = await axios.post('/events', formData);

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
          setFormErrors({ ...formErrors, date: error.response.data.errorDate });
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
              طلب تنظيم نشاط ثقافي
            </Typography>
            <form onSubmit={handleSubmit}>
              {['title', 'duration', 'coordinator', 'laboratory', 'department'].map((field, index) => (
                <Box key={index} sx={{ mb: 0 }}>
                  <label className="font-arabic" htmlFor={field} style={{ display: 'block', textAlign: 'right' }}>
                    {['العنوان', 'مدة النشاط', 'المنسق', 'المختبر', 'الشعبة'][index]}
                  </label>
                  <TextField
                    placeholder={['أدخل العنوان', ' أدخل مدة النشاط ( عدد الساعات )', 'أدخل اسم المنسق', 'أدخل اسم المختبر', 'أدخل اسم الشعبة'][index]}
                    id={field}
                    name={field}
                    type={field === 'duration' ? 'number' : 'text'} // Ensuring duration is a number
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

              <Box sx={{ mb: 0 }}>
                <FormControl fullWidth error={Boolean(formErrors.place)}>
                  <label className="font-arabic" htmlFor="place" style={{ display: 'block', textAlign: 'right' }}>
                    القاعة / المدرج
                  </label>
                  <Select
                    displayEmpty
                    style={{ marginBottom: '11px', marginTop: '12px' }}
                    id="place"
                    name="place"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    inputProps={{ dir: 'rtl' }}
                    value={formData.place}
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled className="font-arabic">
                      اختر القاعة / المدرج
                    </MenuItem>
                    {selectOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value} className="font-arabic">
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.place && (
                    <FormHelperText>{formErrors.place}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box sx={{ mb: 0 }}>
                <label className="font-arabic" htmlFor="date" style={{ display: 'block', textAlign: 'right' }}>
                  تاريخ التنظيم
                </label>
                <TextField
                  id="date"
                  name="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  inputProps={{ dir: 'rtl' }}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(formErrors.date)}
                  helperText={formErrors.date}
                />
              </Box>

              <Button onClick={handleCloseModal} variant="contained" type="button">
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
};

export default ModalAct;
