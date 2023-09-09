import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Grid, Card, CardContent, CardMedia, Typography, Dialog, DialogTitle, Button, Snackbar } from '@mui/material';
import { Box } from '@mui/system';
import ReactApexChart from 'react-apexcharts';


function ApexChart({ crypto, handleClose }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchPriceHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/crypto-price-history/${crypto.name}`);
                setChartData(response.data);
            } catch (error) {
                console.error(`Error fetching price history for ${crypto.name}:`, error);
            }
        };

        fetchPriceHistory();
    }, [crypto.name]);

    if (!chartData) return null;

    const options = {
        series: [{
            name: crypto.name,
            data: chartData.prices
        }],
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: `Fundamental Analysis of ${crypto.name}`,
            align: 'left'
        },
        subtitle: {
            text: 'Price Movements',
            align: 'left'
        },
        labels: chartData.dates,
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            opposite: true
        },
        legend: {
            horizontalAlign: 'left'
        }
    };

    return (
        <Dialog open={true} onClose={handleClose} sx={{ '.MuiDialog-paper': { width: '150vw' } }}>
            <DialogTitle>{crypto.name} Analysis</DialogTitle>
            <div id="chart">
                <ReactApexChart options={options} series={options.series} type="area" height={350} />
            </div>
        </Dialog>
    );
}

function CryptoList() {
    const [cryptos, setCryptos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchCryptos = async () => {
            // Fetching cryptos
            try {
                const response = await axios.get('http://localhost:8000/api/crypto');
                setCryptos(response.data);
            } catch (error) {
                console.error('Error fetching cryptos:', error);
            }
            
            // Fetching user's ID
            try {
                const userResponse = await axios.get('http://localhost:8000/api/user');
                setUserId(userResponse.data.user.id);  // setting the user's ID here
            } catch (userError) {
                console.error('Error fetching user ID:', userError);
            }
        };
    
        fetchCryptos();
    }, []);

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedCrypto(null);
    };

    const handleBuy = async (crypto) => {
        try {
            const response = await axios.post('http://localhost:8000/api/transaction/buy', {
                userId: userId,
                cryptoId: crypto.id
             });
            setSnackbarMessage(response.data.message);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error buying crypto:', error);
    
            // Additional logging to help diagnose the issue
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }
    
            setSnackbarMessage('Error buying crypto.');
            setSnackbarOpen(true);
        }
    };
    

    const handleSell = async (crypto) => {
        try {
            const response = await axios.post('http://localhost:8000/api/transaction/sell', { cryptoId: crypto.id });
            setSnackbarMessage(response.data.message);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error selling crypto:', error);
            setSnackbarMessage('Error selling crypto.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Cryptocurrencies
            </Typography>
            <Grid container spacing={3}>
                {cryptos.map(crypto => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={crypto.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="auto"
                                style={{ maxWidth: '20%', margin: '10px auto 0 auto' }}
                                image={crypto.image}
                                alt={crypto.name}
                                onClick={() => {
                                    setSelectedCrypto(crypto);
                                    setOpenDialog(true);
                                }}
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {crypto.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ${crypto.price}
                                </Typography>
                                <Button color="primary" onClick={() => handleBuy(crypto)}>Buy</Button>
                                <Button color="secondary" onClick={() => handleSell(crypto)}>Sell</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {openDialog && selectedCrypto && <ApexChart crypto={selectedCrypto} handleClose={handleClose} />}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
}

export default CryptoList;
