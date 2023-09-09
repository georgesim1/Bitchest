import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import EuroIcon from '@mui/icons-material/Euro';
import axios from '../api/axios';
import TransactionHistory from './TransactionHistory';

function UserWallet() {
    const [balanceInEuros, setBalanceInEuros] = useState(0);
    const [cryptos, setCryptos] = useState([]);

    const options = {
        chart: {
            width: 400,
            type: 'pie',
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

                // Set cryptocurrencies data and convert amount to float
                if (response.data.cryptos && Array.isArray(response.data.cryptos)) {
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

    console.log("Labels:", cryptos.map(crypto => crypto.name));
    console.log("Series:", cryptos.map(crypto => crypto.amount));

    return (
        <div>


            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Only render chart if cryptos data is available */}
                {cryptos.length > 0 && (
                    <div id="chart" style={{ flex: 1, paddingRight: '20px' }}>
                        <ReactApexChart 
                            options={options} 
                            series={cryptos.map(crypto => crypto.amount)} 
                            type="pie" 
                            width="100%" 
                        />
                        <h1> Total Balance <EuroIcon /> {balanceInEuros}</h1>
                    </div>
                    
                )}
                
                {/* Render TransactionHistory */}
                <div style={{ flex: 1.5 }}>
                    <TransactionHistory />
                </div>
            </div>
        </div>
    );
}

export default UserWallet;
