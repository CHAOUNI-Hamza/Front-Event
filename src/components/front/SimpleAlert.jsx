import * as React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import '../../css/alert-simple.css';

export default function SimpleAlert() {
  return (
    <Alert dir='rtl' className='font-arabic' icon={<CheckIcon fontSize="inherit" />} severity="success">
      تم تسجيل طلبك بنجاح
    </Alert>
  );
}
