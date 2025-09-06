// src/pages/HomePage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

// ייבוא רכיבים מ-MUI
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Button, Grid } from '@mui/material';

// ייבוא פונקציות עזר לעבודה עם תאריכים
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]); // עדיין מחזיק את הרשימה השטוחה מה-API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // שליפת השירותים (נשאר זהה)
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

  // שליפת הזמינות (נשאר זהה)
  useEffect(() => {
    if (!selectedServiceId) {
      setAvailableSlots([]);
      return;
    }
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await api.get(`/api/provider/availability?serviceId=${selectedServiceId}`);
        setAvailableSlots(response.data);
      } catch (err) {
        setError('שגיאה בטעינת זמנים פנויים.');
        console.error("Failed to fetch availability:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedServiceId]);

  // Hook חדש לעיבוד וקיבוץ התורים לפי יום
  const groupedSlots = useMemo(() => {
    if (!availableSlots.length) return {};

    // שימוש ב-reduce כדי לקבץ את המערך לאובייקט
    return availableSlots.reduce((acc, slotStr) => {
      const date = new Date(slotStr);
      const dayKey = format(date, 'yyyy-MM-dd'); // יצירת מפתח ייחודי לכל יום

      if (!acc[dayKey]) {
        acc[dayKey] = []; // אם זה היום הראשון שאנחנו פוגשים, ניצור עבורו מערך ריק
      }
      acc[dayKey].push(date); // הוספת התור למערך של היום המתאים
      return acc;
    }, {});
  }, [availableSlots]); // חישוב מחדש יתבצע רק כאשר availableSlots משתנה

  const handleSelectSlot = (slotDate) => {
    console.log('Selected slot:', slotDate);
    alert(`בחרת תור בתאריך: ${slotDate.toLocaleString('he-IL')}`);
    // כאן נפתח את חלון הדיאלוג
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>קביעת תור חדש</Typography>
      
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

      {/* החלק החדש: הצגת רשימת התורים המקובצים */}
      <Box sx={{ mt: 2 }}>
        {Object.keys(groupedSlots).length > 0 ? (
          Object.entries(groupedSlots).map(([dayKey, slots]) => (
            <Box key={dayKey} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>
                {format(new Date(dayKey), "EEEE, d 'ב'LLLL", { locale: he })}
              </Typography>
              <Grid container spacing={1}>
                {slots.map((slot, index) => (
                  <Grid item xs={4} sm={3} md={2} key={index}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleSelectSlot(slot)}
                    >
                      {format(slot, 'HH:mm')}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          !isLoading && selectedServiceId && <Typography>אין תורים פנויים עבור השירות שנבחר.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;