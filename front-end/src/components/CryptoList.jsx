import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Box } from '@mui/system';

function CryptoList() {
    const [cryptos, setCryptos] = useState([]);

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/crypto');
                setCryptos(response.data);
            } catch (error) {
                console.error('Error fetching cryptos:', error);
            }
        };

        fetchCryptos();
    }, []);

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
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {crypto.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ${crypto.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default CryptoList;
