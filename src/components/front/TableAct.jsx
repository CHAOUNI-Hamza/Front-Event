import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import '../../css/table-act.css';

function formatDate(dateString) {
  return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
}

function HomeView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Utilisation de useMediaQuery pour détecter la taille de l'écran
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/events/events_auth?page=${currentPage}`, {
          params: { search: searchTerm }
        });
        setEvents(response.data.data);
        setTotalPages(response.data.last_page);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, searchTerm]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) return <div><div className="loader"></div></div>;
  if (error) return <div>Error: {error.message}</div>;

  // Composant Card pour les appareils mobiles
  const EventCard = ({ event }) => (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography className='font-arabic text-left' sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {formatDate(event.date)}
        </Typography>
        <Typography className='font-arabic' variant="h5" component="div">
          <strong>العنوان : </strong><span>{event.title}</span>
        </Typography>
        <Typography className='font-arabic'>
        <strong>المنسق : </strong><span>{event.coordinator}</span>
        </Typography>
        <Typography  className='font-arabic' variant="body2">
        <strong>الشعبة : </strong><span>{event.department}</span>
        </Typography>
        <Typography className='font-arabic' variant="body2">
        <strong>المختبر : </strong><span>{event.laboratory}</span>
        </Typography>
        <Typography className='font-arabic' variant="body2">
        <strong>مدة النشاط : </strong><span> س {event.duration}</span>
        </Typography>
        <Typography className='font-arabic' variant="body2">
        <strong>القاعة / المرج : </strong>
        <span>
            {event.place === 'amphie-fatima-mernissi' && <span className="text-right">قاعة فاطمة المرنيسي</span>}
            {event.place === 'amphie-fatima-fihriya' && <span className="text-right">مدرج فاطمة الفهرية</span>}
            {event.place === 'amphie-imame-malik' && <span className="text-right">مدرج الإمام مالك</span>}
            {event.place === 'amphie-youssi' && <span className="text-right">مدرج اليوسي</span>}
            {event.place === 'autre' && <span className="text-right">آخر</span>}
          </span>
        </Typography>
        <Typography className='font-arabic' variant="body2">
        <strong>نوع النشاط : </strong>
        <span>
            {event.type === 'scientifique' && <span>علمي</span>}
            {event.type === 'culturelle' && <span>ثقافي</span>}
            {event.type === 'autre' && <span>آخر</span>}
          </span>
        </Typography>
        <Typography className='font-arabic' variant="body2">
        <strong>الحالة  : </strong>
          <span style={{
            color:
              event.status === 'encours' ? 'orange' :
              event.status === 'valider' ? 'green' :
              event.status === 'novalider' ? 'red' : '',
            padding: 5,
            borderRadius: 3
          }}>
            {event.status === 'encours' ? 'جاري' :
             event.status === 'valider' ? 'مقبول' :
             event.status === 'novalider' ? 'مرفوض' : ''}
          </span>
        </Typography>
      </CardContent>
      <CardActions>
      
      </CardActions>
    </Card>
  );

  return (
    <div>
      {/* Ajout du champ de recherche avec placeholder */}
      <TextField
        label="ابحث بعنوان النشاط"
        placeholder="ابحث بعنوان النشاط"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        margin="normal"
      />
      {isMobile ? (
        // Affichage des cartes pour les appareils mobiles
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        // Affichage de la table pour les appareils non mobiles
        <TableContainer dir='rtl' sx={{ mt: 10, mb: 2, p: 0 }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="font-arabic" align="right">العنوان</TableCell>
                <TableCell className="font-arabic" align="right">تاريخ التنظيم</TableCell>
                <TableCell className="font-arabic" align="right">مدة النشاط</TableCell>
                <TableCell className="font-arabic" align="right">القاعة / المدرج</TableCell>
                <TableCell className="font-arabic" align="right">المنسق</TableCell>
                <TableCell className="font-arabic" align="right">المختبر</TableCell>
                <TableCell className="font-arabic" align="right">الشعبة</TableCell>
                <TableCell className="font-arabic" align="right">نوع النشاط</TableCell>
                <TableCell className="font-arabic" align="right">الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow style={{ backgroundColor: 'white' }} key={event.id}>
                  <TableCell className="font-arabic" align="right" title={event.title}>
                    {event.title.length > 10 ? event.title.slice(0, 10) + '...' : event.title}
                  </TableCell>
                  <TableCell className="font-arabic" dir='ltr' align="right">{formatDate(event.date)}</TableCell>
                  <TableCell className="font-arabic" align="right">{event.duration} س</TableCell>
                  <TableCell className="font-arabic" align="right">
                    {event.place === 'amphie-fatima-mernissi' && <span className="text-right">قاعة فاطمة المرنيسي</span>}
                    {event.place === 'amphie-fatima-fihriya' && <span className="text-right">مدرج فاطمة الفهرية</span>}
                    {event.place === 'amphie-imame-malik' && <span className="text-right">مدرج الإمام مالك</span>}
                    {event.place === 'amphie-youssi' && <span className="text-right">مدرج اليوسي</span>}
                    {event.place === 'autre' && <span className="text-right">آخر</span>}
                  </TableCell>
                  <TableCell className="font-arabic" align="right">{event.coordinator}</TableCell>
                  <TableCell className="font-arabic" align="right">{event.laboratory}</TableCell>
                  <TableCell className="font-arabic" align="right">{event.department}</TableCell>
                  <TableCell className="font-arabic" align="right">
                    {event.type === 'scientifique' && <span>علمي</span>}
                    {event.type === 'culturelle' && <span>ثقافي</span>}
                    {event.type === 'autre' && <span>آخر</span>}
                  </TableCell>
                  <TableCell className="font-arabic" align="right">
                    <span style={{
                      color:
                        event.status === 'encours' ? 'orange' :
                        event.status === 'valider' ? 'green' :
                        event.status === 'novalider' ? 'red' : '',
                      padding: 5,
                      borderRadius: 3
                    }}>
                      {event.status === 'encours' ? 'جاري' :
                       event.status === 'valider' ? 'مقبول' :
                       event.status === 'novalider' ? 'مرفوض' : ''}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          siblingCount={1}
          boundaryCount={1}
          showFirstButton
          showLastButton
        />
      </Stack>
    </div>
  );
}

export default HomeView;
