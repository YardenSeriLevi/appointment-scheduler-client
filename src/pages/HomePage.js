// src/pages/HomePage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

// ייבוא רכיבים מ-MUI
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

// ייבוא פונקציות עזר לעבודה עם תאריכים
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const HomePage = () => {
    const { isAuthenticated } = useAuth();
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [guestInfo, setGuestInfo] = useState({ name: '', phone: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

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

    useEffect(() => {
        if (!selectedServiceId) {
            setAvailableSlots([]);
            return;
        }
        const fetchAvailability = async () => {
            try {
                setIsLoading(true);
                setError('');
                setSuccessMessage('');
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
    }, [selectedServiceId, bookingSuccess]);

    const groupedSlots = useMemo(() => {
        if (!availableSlots.length) return {};
        return availableSlots.reduce((acc, slotStr) => {
            const date = new Date(slotStr);
            const dayKey = format(date, 'yyyy-MM-dd');
            if (!acc[dayKey]) acc[dayKey] = [];
            acc[dayKey].push(date);
            return acc;
        }, {});
    }, [availableSlots]);

    const openBookingModal = (slotDate) => {
        setSelectedSlot(slotDate);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSlot(null);
        setGuestInfo({ name: '', phone: '' });
    };

    const handleConfirmBooking = async () => {
        if (!isAuthenticated && (!guestInfo.name || !guestInfo.phone)) {
            alert("נא למלא שם וטלפון.");
            return;
        }
        try {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');

            if (isAuthenticated) {
                // לוגיקה למשתמש רשום
                alert('(משתמש רשום) התור נקבע בהצלחה!');

            } else {
                await api.post('/api/provider/book-as-guest', {
                    serviceId: selectedServiceId,
                    startTime: selectedSlot,
                    guestName: guestInfo.name,
                    guestPhone: guestInfo.phone,
                });
            }

            setSuccessMessage('התור נקבע בהצלחה!');
            closeModal();
            setBookingSuccess(prev => !prev);
        } catch (err) {
            const errorMessage = err.response?.data || 'שגיאה בקביעת התור.';
            setError(errorMessage);
            console.error("Booking failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <> {/* <-- שימוש ב-React.Fragment כדי לעטוף את כל התוכן */}
            <Box>
                <Typography variant="h4" gutterBottom>קביעת תור חדש</Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                
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
                                            <Button variant="outlined" fullWidth onClick={() => openBookingModal(slot)}>
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

            <Dialog open={isModalOpen} onClose={closeModal}>
                <DialogTitle sx={{ textAlign: 'center' }}>אישור קביעת תור</DialogTitle>
                <DialogContent>
                    {selectedSlot && (
                        <Box sx={{ p: 2, minWidth: '300px' }}>
                            <Typography variant="h6" gutterBottom>פרטי התור:</Typography>
                            <Typography>
                                <strong>שירות:</strong> {services.find(s => s.id.toString() === selectedServiceId.toString())?.name}
                            </Typography>
                            <Typography>
                                <strong>תאריך:</strong> {format(selectedSlot, "EEEE, d 'ב'LLLL", { locale: he })}
                            </Typography>
                            <Typography>
                                <strong>שעה:</strong> {format(selectedSlot, 'HH:mm')}
                            </Typography>
                            {!isAuthenticated && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" gutterBottom>נא למלא פרטים להשלמת ההזמנה:</Typography>
                                    <TextField autoFocus margin="dense" label="שם מלא" type="text" fullWidth variant="standard" value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} />
                                    <TextField margin="dense" label="מספר טלפון" type="tel" fullWidth variant="standard" value={guestInfo.phone} onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })} />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeModal}>ביטול</Button>
                    <Button onClick={handleConfirmBooking} variant="contained" disabled={isLoading}>
                        {isLoading ? 'קובע...' : 'אישור וקביעת תור'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default HomePage;