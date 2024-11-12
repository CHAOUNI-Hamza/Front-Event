import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '../../components/front/card'; // Assuming correct path to Card component
import TableAct from '../../components/front/TableAct'; // Assuming correct path to TableAct component
import TableMob from '../../components/front/TableMob'; // Assuming correct path to TableMob component
import Calendrier from '../../components/front/Calendrier'; // Assuming correct path to Calendrier component
import '../../css/tabs.css';
import { useNavigate } from 'react-router-dom';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pt: 5 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function BasicTabs({ userRole }) {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 3 && userRole === 'admin') {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login'); // Assuming '/login' is your login route
  };

  // Calculate the actual index for the "الأنشطة المبرمجة" tab
  const indexForProgrammedActivities = userRole === 'admin' ? 4 : 3;

  return (
    <Box sx={{ width: '100%', pt: 3 }}>
      <Box dir="rtl" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{ pr: 3 }} className="font-arabic size" label="طلب جديد" />
          <Tab sx={{ pr: 3 }} className="font-arabic size" label="الأنشطة" />
          <Tab sx={{ pr: 3 }} className="font-arabic size" label="الحركية" />
          {userRole === 'admin' && (
            <Tab sx={{ pr: 3 }} className="font-arabic size" label="لوحة القيادة" />
          )}
          <Tab sx={{ pr: 3 }} className="font-arabic size" label="الأنشطة المبرمجة" />
          <Tab sx={{ pr: 3 }} className="font-arabic size" label="تسجيل الخروج" onClick={handleLogout} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Card />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TableAct />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TableMob />
      </CustomTabPanel>
      {userRole === 'admin' && (
        <CustomTabPanel value={value} index={3}>
          {/* Dashboard content can go here if needed */}
        </CustomTabPanel>
      )}
      <CustomTabPanel value={value} index={indexForProgrammedActivities}>
        <Calendrier />
      </CustomTabPanel>
    </Box>
  );
}

BasicTabs.propTypes = {
  userRole: PropTypes.string.isRequired,
};
