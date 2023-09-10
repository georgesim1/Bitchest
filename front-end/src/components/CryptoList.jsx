import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { 
    Grid, Card, CardContent, CardMedia, Typography, Dialog, DialogTitle, 
    DialogContent, DialogContentText, DialogActions, Button, Snackbar, TextField 
} from '@mui/material';
import { Box } from '@mui/system';
import ReactApexChart from 'react-apexcharts';

const cardStyle = {
    root: {
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '15px', 
        transition: 'transform 0.3s ease-in-out',  
        '&:hover': {
            transform: 'scale(1.03)' 
        }
    },
    media: {
        maxWidth: '20%', 
        margin: '10px auto 0 auto',
        borderRadius: '50%'
    },
    content: {
        padding: '15px'
    },
    buyButton: {
        marginTop: '10px'
    }
};

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
        <Dialog open={true} onClose={handleClose} sx={{ '.MuiDialog-paper': { width: '180vw' } }}>
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
    const [buyDialogOpen, setBuyDialogOpen] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/crypto');
                setCryptos(response.data);
            } catch (error) {
                console.error('Error fetching cryptos:', error);
            }
           
            try {
                const userResponse = await axios.get('http://localhost:8000/api/user');
                setUserId(userResponse.data.user.id);  
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

    const handleOpenBuyDialog = (crypto) => {
        setSelectedCrypto(crypto);
        setBuyDialogOpen(true);
    };

    const handleBuy = async (crypto, quantity) => {
        try {
            const response = await axios.post('http://localhost:8000/api/transaction/buy', {
                userId: userId,
                cryptoId: crypto.id,
                quantity: quantity 
            });
            setSnackbarMessage(response.data.message);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error buying crypto:', error);
    
            
            if (error.response && error.response.data.message === "Insufficient balance") {
                setSnackbarMessage('You do not have enough balance to make this purchase.');
            } else {
                setSnackbarMessage('Error buying crypto.');
            }
            setSnackbarOpen(true);
    
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }
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
                        <Card style={cardStyle.root}>
                            <CardMedia
                                component="img"
                                height="100vw"
                                style={cardStyle.media}
                                image={crypto.image}
                                alt={crypto.name}
                                onClick={() => {
                                    setSelectedCrypto(crypto);
                                    setOpenDialog(true);
                                }}
                            />
                            <CardContent style={cardStyle.content}>
                                <Typography variant="h5" component="div">
                                    {crypto.name}
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    ${crypto.price}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    style={cardStyle.buyButton} 
                                    onClick={() => handleOpenBuyDialog(crypto)}
                                >
                                    Buy
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {openDialog && selectedCrypto && <ApexChart crypto={selectedCrypto} handleClose={handleClose} />}

            <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)}>
                <DialogTitle>Buy {selectedCrypto?.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the amount of {selectedCrypto?.name} you like to purchase
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Quantity"
                        type="number"
                        value={buyQuantity}
                        onChange={(e) => setBuyQuantity(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBuyDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        handleBuy(selectedCrypto, buyQuantity);
                        setBuyDialogOpen(false);
                    }} color="primary">
                        Buy
                    </Button>
                </DialogActions>
            </Dialog>

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
