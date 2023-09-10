import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import EuroIcon from '@mui/icons-material/Euro';
import axios from '../api/axios';
import TransactionHistory from './TransactionHistory';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';

function UserWallet() {
    const [balanceInEuros, setBalanceInEuros] = useState(0);
    const [cryptos, setCryptos] = useState([]);
    const [openSellModal, setOpenSellModal] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [userId, setUserId] = useState(null);

    const options = {
        chart: {
            width: 400,
            type: 'pie',
        },
        legend: {
            position: 'bottom'
        },
        labels: cryptos.map(crypto => crypto.name),
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    useEffect(() => {
        async function fetchUserWallet() {
            try {
                const response = await axios.get('http://localhost:8000/api/user-wallet');
                setBalanceInEuros(response.data.totalInEuros);
                console.log(response.data);
                if (response.data.wallet) setUserId(response.data.wallet.user_id)
                if (response.data.cryptos && Array.isArray(response.data.cryptos)){
                    setCryptos(response.data.cryptos.map(crypto => ({
                        ...crypto,
                        amount: parseFloat(crypto.amount)
                    })));
                }
            } catch (error) {
                console.error("Error fetching user's wallet:", error);
            }
        }

        fetchUserWallet();
    }, []);

    const handleOpenSellModal = () => {
        setOpenSellModal(true);
    };

    const handleCloseSellModal = () => {
        setOpenSellModal(false);
    };
    const handleSellCrypto = async () => {
        try {
            const cryptoToSell = cryptos.find(crypto => crypto.name === selectedCrypto);
            console.log(cryptos);
            console.log("Found crypto object:", cryptoToSell);
            if (!cryptoToSell) {
                console.error("Selected crypto not found!");
                return;
            }
    
            const quantityToSell = cryptoToSell.amount;
    
            const response = await axios.post('http://localhost:8000/api/transaction/sell', {
                user_id: userId, 
                crypto_id: cryptoToSell.name,
                quantity: quantityToSell
            });

    
            if (response.data && response.data.message) {
                console.log(response.data.message);
            }
    
            handleCloseSellModal();
            fetchUserWallet();
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error("Error selling crypto:", error.response.data.message);
            } else {
                console.error("Error selling crypto:", error);
            }
        }
    };
    

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {cryptos.length > 0 && (
                    <div id="chart" style={{ flex: 1, paddingRight: '20px' }}>
                        <ReactApexChart 
                            options={options} 
                            series={cryptos.map(crypto => crypto.amount)} 
                            type="pie" 
                            width="100%" 
                        />
                    </div>
                )}
                
                <div style={{ flex: 1.5 }} className=''>
                    <TransactionHistory />
                    <Typography variant="h5"> Total Balance <EuroIcon /> {balanceInEuros}</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenSellModal}>Sell Cryptocurrency</Button>
                </div>
            </div>

            <Modal
                open={openSellModal}
                onClose={handleCloseSellModal}
                aria-labelledby="sell-crypto-modal-title"
                aria-describedby="sell-crypto-modal-description"
            >
                <div style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', width: 400, backgroundColor: 'white', padding: '20px' }}>
                    <h2 id="sell-crypto-modal-title">Sell Cryptocurrency</h2>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Cryptocurrency</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedCrypto}
                            onChange={(event) => setSelectedCrypto(event.target.value)}
                        >
                            {cryptos.map(crypto => (
                                <MenuItem key={crypto.name} value={crypto.name}>
                                    {crypto.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br />
                    <br />
                    <Button variant="contained" color="primary" onClick={handleSellCrypto}>Sell</Button>
                </div>
            </Modal>
        </div>
    );
}

export default UserWallet;
