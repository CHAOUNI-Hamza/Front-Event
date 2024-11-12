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
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../../css/table-act.css';

function formatDate(dateString) {
  return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
}

function formatDateRes(dateString) {
  const date = new Date(dateString);
  const formattedDate = format(date, 'dd/MM/yyyy', { locale: fr });
  return formattedDate;
}

const EventCard = ({ event }) => (
  <Card sx={{ minWidth: 275, mb: 2 }}>
    <CardContent>
      <Typography className='font-arabic'>
        <strong>الإسم و النسب : </strong> <span>{event.first_name_benefit} {event.last_name_benefit}</span>
      </Typography>
      <Typography className='font-arabic'>
      <strong>الوجهة : </strong><span>{event.destination}</span>
      </Typography>
      <Typography className='font-arabic'>
      <strong>المختبر : </strong><span>{event.laboratory}</span>
      </Typography>
      <Typography className='font-arabic'>
      <strong>تاريخ الذهاب : </strong><span>{formatDateRes(event.date_go)}</span>
      </Typography>
      <Typography className='font-arabic'>
      <strong>تاريخ العودة : </strong><span>{formatDateRes(event.date_return)}</span>
      </Typography>
      <Typography className='font-arabic'>
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

function HomeView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/mobilitys/mobilite_auth?page=${currentPage}`, {
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

  return (
    <div>
      {isMobile ? (
        <Box sx={{ mt: 10, mb: 2, p: 2 }}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Box>
      ) : (
        <TableContainer  dir='rtl' sx={{ mt: 10, mb: 2, p: 0 }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="font-arabic" align="right">إسم المستفيد</TableCell>
                <TableCell className="font-arabic" align="right">نسب المستفيد</TableCell>
                <TableCell className="font-arabic" align="right">تاريخ الذهاب</TableCell>
                <TableCell className="font-arabic" align="right">تاريخ العودة</TableCell>
                <TableCell className="font-arabic" align="right">الوجهة</TableCell>
                <TableCell className="font-arabic" align="right">المختبر</TableCell>
                <TableCell className="font-arabic" align="right">الشعبة</TableCell>
                <TableCell className="font-arabic" align="right">الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow style={{ backgroundColor: 'white' }} key={event.id}>
                  <TableCell className="font-arabic" align="right">{event.first_name_benefit}</TableCell>
                  <TableCell className="font-arabic" align="right">{event.last_name_benefit}</TableCell>
                  <TableCell className="font-arabic" dir='ltr' align="right">{formatDate(event.date_go)}</TableCell>
                  <TableCell className="font-arabic" dir='ltr' align="right">{formatDate(event.date_return)}</TableCell>
                  <TableCell className="font-arabic" align="right">{event.destination}</TableCell>
                  <TableCell className="font-arabic" align="right">{event.laboratory}</TableCell>
                  <TableCell className="font-arabic" align="right">{event.department}</TableCell>
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
