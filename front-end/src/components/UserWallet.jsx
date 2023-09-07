import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../api/axios'; // Assuming you're using axios to make API calls

function UserWallet() {
    const [balanceInEuros, setBalanceInEuros] = useState(0);
    const [cryptos, setCryptos] = useState([]);

    const options = {
        chart: {
            type: 'donut',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
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
                setCryptos(response.data.cryptos.map(crypto => crypto.amount)); // Extract just the amounts for the chart series
            } catch (error) {
                console.error("Error fetching user's wallet:", error);
            }
        }

        fetchUserWallet();
    }, []);

    return (
        <div>
            <h2>User Wallet</h2>
            <p>Total Balance in Euros: {balanceInEuros}</p>

            <div id="chart">
                <ReactApexChart options={options} series={cryptos} type="donut" height={300} />
            </div>
        </div>
    );
}

export default UserWallet;
