import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import '../../css/card.css';
import clipboard from "../../assets/clipboard.png";
import school from "../../assets/school.png";
import driving from "../../assets/driving.png";
import ModalAct from './ModalAct';
import ModalMob from './ModalMob';
import ModalCul from './ModalCul';
import SimpleAlert from './SimpleAlert';

export default function MultiActionAreaCard() {
  const [open, setOpen] = React.useState({ act: false, mob: false, cul: false });
  const [showAlert, setShowAlert] = React.useState(false);

  const data = [
    {
      ar: 'طلب تنظيم نشاط علمي',
      fr: 'ACTIVITÉ SCIENTIFIQUE',
      img: clipboard,
      style: { width: '199px', height: '166px' },
      modal: 'act',
    },
    {
      ar: 'طلب تنظيم نشاط ثقافي',
      fr: 'ACTIVITÉ CULTURELLE',
      img: school,
      style: { width: '199px', height: '166px' },
      modal: 'cul',
    },
    {
      ar: 'الحركية',
      fr: 'MOBILITÉ',
      img: driving,
      style: { width: '199px', height: '166px' },
      modal: 'mob',
    }
  ];

  const handleOpen = (modalType) => {
    setOpen((prevState) => ({ ...prevState, [modalType]: true }));
  };

  const handleClose = (modalType) => {
    setOpen((prevState) => ({ ...prevState, [modalType]: false }));
  };

  return (
    <>
      {showAlert && <SimpleAlert />}
      <Grid dir='rtl' container spacing={1} sx={{ flexGrow: 1 }}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 345 }}>
              <CardActionArea onClick={() => handleOpen(item.modal)} sx={{ padding: 4 }}>
                <CardMedia
                  component="img"
                  image={item.img}
                  alt={item.img}
                  sx={item.style}
                  className="test"
                />
                <CardContent sx={{ textAlign: 'center', pl: 0, pr: 0 }}>
                  <Typography color="#00b0ff" className='font-arabic' gutterBottom variant="h5" component="div">
                    {item.ar}
                  </Typography>
                  <Typography color="#00b0ff" sx={{ fontFamily: 'Cambria W02 Regular' }} gutterBottom variant="h5" component="div">
                    {item.fr}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ModalAct open={open.act} handleClose={() => handleClose('act')} setShowAlert={setShowAlert} />
      <ModalCul open={open.cul} handleClose={() => handleClose('cul')} setShowAlert={setShowAlert} />
      <ModalMob open={open.mob} handleClose={() => handleClose('mob')} setShowAlert={setShowAlert} />
    </>
  );
}
