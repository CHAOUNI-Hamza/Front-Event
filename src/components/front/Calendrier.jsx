import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Button, Modal, Box, Typography } from '@mui/material'; // Import des composants de Material-UI

moment.locale('fr');
const localizer = momentLocalizer(moment);

function formatDateRes(dateString) {
  const date = new Date(dateString);
  const formattedDate = format(date, 'dd/MM/yyyy', { locale: fr });
  return formattedDate;
}

const MyCalendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State pour stocker l'événement sélectionné
  const [open, setOpen] = useState(false); // State pour gérer l'ouverture et la fermeture du modal

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events/val'); // Assurez-vous de l'URL correcte de votre API
        console.log(response.data.data);
        const formattedEvents = response.data.data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.date),
          end: new Date(event.date),
          duration: event.duration,
          place: event.place,
          type: event.type,
          status: event.status,
          coordinator: event.coordinator,
          laboratory: event.laboratory,
          department: event.department,
        }));

        setCurrentEvents(formattedEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements :', error);
      }
    };

    fetchEvents();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const messages = {
    allDay: 'Toute la journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: "Aujourd'hui",
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement dans cette période',
    showMore: total => `+ ${total} événement(s) supplémentaire(s)`,
  };

  const handleSelectEvent = event => {
    setSelectedEvent(event); // Met à jour l'état avec l'événement sélectionné
    handleOpen(); // Ouvre le modal lorsqu'un événement est sélectionné
  };

  const handleCloseModal = () => {
    setSelectedEvent(null); // Réinitialise l'état de l'événement sélectionné à null
    handleClose(); // Ferme le modal
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={currentEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        titleAccessor="title"
        tooltipAccessor="desc"
        views={['month', 'week', 'day']}
        messages={messages}
        onSelectEvent={handleSelectEvent} // Appelé lorsque l'utilisateur clique sur un événement
      />

      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedEvent && (
            <>
              <Modal
  open={open}
  onClose={handleCloseModal}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,  // Augmentation de la largeur à 600 pixels
      maxWidth: '90%',  // Optionnel : pour limiter la largeur maximale en pourcentage de l'écran
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    }}
  >
    {selectedEvent && (
      <>
        <Typography style={{ textAlign: 'right', color: 'cadetblue', fontSize: 'x-large' }} className='font-arabic' dir='rtl' id="modal-modal-title" variant="h6" component="h2">
          {selectedEvent.title}
        </Typography>
        <Typography style={{ textAlign: 'right', fontSize: 'larger' }} className='font-arabic' dir='rtl' id="modal-modal-description" sx={{ mt: 2 }}>
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>تاريخ التنظيم :</strong> <span > {formatDateRes(selectedEvent.start)}</span>
                <br />
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>مدة النشاط  :</strong> {selectedEvent.duration}
                <br />
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>المكان :</strong>{' '}
                {selectedEvent.place === 'amphie-fatima-mernissi' && <span className="text-right">قاعة فاطمة المرنيسي</span>}
                {selectedEvent.place === 'amphie-fatima-fihriya' && <span className="text-right">مدرج فاطمة الفهرية</span>}
                {selectedEvent.place === 'amphie-imame-malik' && <span className="text-right">مدرج الإمام مالك</span>}
                {selectedEvent.place === 'amphie-youssi' && <span className="text-right">مدرج اليوسي</span>}
                {selectedEvent.place === 'autre' && <span className="text-right">آخر</span>}
                <br />
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>المنسق  :</strong> {selectedEvent.coordinator}
                <br />
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>المختبر  :</strong> {selectedEvent.laboratory}
                <br />
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>الشعبة  :</strong> {selectedEvent.department}
                <br />
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>نوع النشاط :</strong>{' '}
                {selectedEvent.type === 'scientifique' && <span>علمي</span>}
                {selectedEvent.type === 'culturelle' && <span>ثقافي</span>}
                {selectedEvent.type === 'autre' && <span>آخر</span>}
                <br />
                <strong style={{color: 'darkslateblue', marginLeft: '12px'}}>الحالة :</strong>
                <span
                  style={{
                    color:
                      selectedEvent.status === 'encours' ? 'orange' :
                      selectedEvent.status === 'valider' ? 'green' :
                      selectedEvent.status === 'novalider' ? 'red' : '',
                    padding: 5,
                    borderRadius: 3
                  }}
                >
                  {selectedEvent.status === 'encours' ? 'جاري' :
                   selectedEvent.status === 'valider' ? 'مقبول' :
                   selectedEvent.status === 'novalider' ? 'مرفوض' : ''}
                </span>
                <br />
              </Typography>
        <Button style={{ textAlign: 'right' }} className='font-arabic' dir='rtl' onClick={handleCloseModal} sx={{ mt: 2 }}>
          إغلاق
        </Button>
      </>
    )}
  </Box>
</Modal>

            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default MyCalendar;
