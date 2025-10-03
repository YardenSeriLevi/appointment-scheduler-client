import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';

import { 
    Box, Typography, Select, MenuItem, FormControl, InputLabel, 
    CircularProgress, Alert, Button, Grid, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField 
} from '@mui/material';

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
    const [dialogErrors, setDialogErrors] = useState({});

    // שליפת רשימת השירותים - ללא שינוי
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                setError('');
                const response = await api.get('/api/provider/services');
                setServices(response.data);
            } catch (err) {
                setError('שגיאה בטעינת השירותים.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    // שליפת זמינות - ללא שינוי
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
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvailability();
    }, [selectedServiceId, bookingSuccess]);

    // ============================ תיקון 1: פרשנות הזמן מהשרת ============================
    const groupedSlots = useMemo(() => {
        if (!availableSlots.length) return {};
        return availableSlots.reduce((acc, slotStr) => {
            // הדרך הנכונה: השתמשי ב-parseISO. היא תייצר אובייקט Date
            // שמייצג את הזמן הנכון ב-UTC. פונקציית format תדע להציג אותו נכון.
            const date = parseISO(slotStr);
            const dayKey = format(date, 'yyyy-MM-dd');

            if (!acc[dayKey]) acc[dayKey] = [];
            acc[dayKey].push(date);
            return acc;
        }, {});
    }, [availableSlots]);
    // ======================================================================================

    const openBookingModal = (slotDate) => {
        setSelectedSlot(slotDate);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSlot(null);
        setGuestInfo({ name: '', phone: '' });
        setDialogErrors({});
    };

    const handleConfirmBooking = async () => {
        if (!isAuthenticated) {
            const newErrors = {};
            if (!guestInfo.name.trim()) newErrors.name = "שם הוא שדה חובה.";
            if (!guestInfo.phone.trim()) newErrors.phone = "טלפון הוא שדה חובה.";

            setDialogErrors(newErrors);
            if (Object.keys(newErrors).length > 0) return;
        }

        // ============================ תיקון 2: שליחת הזמן לשרת ============================
        // הדרך הנכונה: toISOString() תמיד מחזירה UTC, וזה בדיוק מה שהשרת מצפה לו.
        const timeToSend = selectedSlot.toISOString();
        // =================================================================================

        try {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');

            const payload = {
                serviceId: selectedServiceId,
                startTime: timeToSend, // <-- שליחת הזמן הנכון
            };

            if (isAuthenticated) {
                await api.post('/api/appointment', payload);
            } else {
                await api.post('/api/provider/book-as-guest', {
                    ...payload,
                    guestName: guestInfo.name,
                    guestPhone: guestInfo.phone,
                });
            }

            let successMsg = 'התור נקבע בהצלחה!';
            if (!isAuthenticated) {
                successMsg = `התור עבור ${guestInfo.name} נקבע בהצלחה!`;
            }
            setSuccessMessage(successMsg);
            
            setTimeout(() => setSuccessMessage(''), 5000);

            closeModal();
            setBookingSuccess(prev => !prev);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || 'שגיאה בקביעת התור.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            {/* ... שאר קוד ה-JSX נשאר זהה לחלוטין ... */}
            {/* החלק של התצוגה, הדיאלוג והטפסים נכון ולא צריך שינוי */}

            <Typography variant="h4" gutterBottom>קביעת תור חדש</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

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
                                {format(parseISO(dayKey), "EEEE, d 'ב'LLLL", { locale: he })}
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
                                    <TextField 
                                        autoFocus 
                                        margin="dense" 
                                        label="שם מלא" 
                                        type="text" 
                                        fullWidth 
                                        variant="standard"
                                        value={guestInfo.name} 
                                        onChange={(e) => {
                                            setGuestInfo({ ...guestInfo, name: e.target.value });
                                            if (dialogErrors.name) setDialogErrors({ ...dialogErrors, name: '' });
                                        }}
                                        error={!!dialogErrors.name}
                                        helperText={dialogErrors.name}
                                    />
                                    <TextField 
                                        margin="dense" 
                                        label="מספר טלפון" 
                                        type="tel" 
                                        fullWidth 
                                        variant="standard" 
                                        value={guestInfo.phone}
                                        onChange={(e) => {
                                            setGuestInfo({ ...guestInfo, phone: e.target.value });
                                            if (dialogErrors.phone) setDialogErrors({ ...dialogErrors, phone: '' });
                                        }}
                                        error={!!dialogErrors.phone}
                                        helperText={dialogErrors.phone}
                                    />
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
        </Box>
    );
};

export default HomePage;