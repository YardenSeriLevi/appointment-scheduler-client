// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

// ייבוא רכיבים מ-MUI
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';

// ייבוא רכיבים מספריית לוח השנה
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import he from 'date-fns/locale/he'; // ייבוא לוקליזציה לעברית
import 'react-big-calendar/lib/css/react-big-calendar.css'; // ייבוא העיצוב של לוח השנה

// הגדרת הלוקליזציה של לוח השנה לעברית
const locales = {
  'he': he,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }), // שבוע מתחיל ביום ראשון
  getDay,
  locales,
});

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // ניהול מצב (State)
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // שליפת רשימת השירותים מהשרת כשהרכיב נטען
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await api.get('/api/provider/services');
        setServices(response.data);
      } catch (err) {
        setError('שגיאה בטעינת השירותים.');
        console.error("Failed to fetch services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // שליפת זמינות כאשר המשתמש בוחר שירות
  useEffect(() => {
    if (!selectedServiceId) {
      setAvailableSlots([]); // איפוס תורים קודמים אם מבטלים בחירת שירות
      return;
    }

    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await api.get(`/api/provider/availability?serviceId=${selectedServiceId}`);
        
        // מציאת אובייקט השירות המלא כדי לדעת את משך הזמן שלו
        const selectedService = services.find(s => s.id.toString() === selectedServiceId.toString());
        if (!selectedService) {
            console.warn("Selected service not found in the services list.");
            return;
        }

        // המרת מערך מחרוזות התאריכים למבנה הנכון של לוח השנה
        const formattedSlots = response.data.map(startTimeStr => {
          const startTime = new Date(startTimeStr);
          
          // חישוב זמן הסיום על ידי הוספת משך השירות (בדקות) לזמן ההתחלה
          const endTime = new Date(startTime.getTime() + selectedService.durationInMinutes * 60000);
          
          return {
            title: selectedService.name, // נציג את שם השירות על האירוע
            start: startTime,
            end: endTime,
          };
        });
           debugger; 
        setAvailableSlots(formattedSlots);

      } catch (err) {
        setError('שגיאה בטעינת זמנים פנויים.');
        console.error("Failed to fetch availability:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedServiceId, services]); // הוספנו את services כתלות

  // פונקציה שתופעל כאשר המשתמש ילחץ על משבצת זמן
  const handleSelectSlot = (slotInfo) => {
    console.log('Selected slot:', slotInfo);
    alert(`בחרת תור בתאריך: ${slotInfo.start.toLocaleString('he-IL')}`);
    // בהמשך נוסיף כאן את הלוגיקה לקביעת התור עם חלון דיאלוג
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        קביעת תור חדש
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="service-select-label">בחירת שירות</InputLabel>
        <Select
          labelId="service-select-label"
          value={selectedServiceId}
          label="בחירת שירות"
          onChange={(e) => setSelectedServiceId(e.target.value)}
        >
          {services.map((service) => (
            <MenuItem key={service.id} value={service.id}>
              {`${service.name} (${service.durationInMinutes} דקות) - ${service.price}₪`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}

      <Box sx={{ height: '600px', direction: 'ltr' }}> {/* הוספת direction ltr ליומן עצמו */}
        <Calendar
          localizer={localizer}
          events={availableSlots}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectSlot}
          culture='he'
          rtl={true} // הגדרה מפורשת של RTL ליומן
          messages={{
            next: "הבא",
            previous: "הקודם",
            today: "היום",
            month: "חודש",
            week: "שבוע",
            day: "יום",
            agenda: "סדר יום",
            date: "תאריך",
            time: "שעה",
            event: "אירוע",
            noEventsInRange: "אין תורים פנויים בטווח זה."
          }}
          defaultView="week" // תצוגת ברירת מחדל
          min={new Date(0, 0, 0, 8, 0, 0)} // שעת התחלה ביומן (8 בבוקר)
          max={new Date(0, 0, 0, 20, 0, 0)} // שעת סיום ביומן (8 בערב)
        />
      </Box>
    </Box>
  );
};

export default HomePage;