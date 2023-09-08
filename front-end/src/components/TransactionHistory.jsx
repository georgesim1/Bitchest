import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Assuming axios is set up for API calls

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await axios.get('http://localhost:8000/api/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        }

        fetchTransactions();
    }, []);

    return (
        <div>
            <h2>Transaction History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Time</th>
                        <th>Crypto</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.transaction_type}</td>
                            <td>{new Date(transaction.created_at).toLocaleString()}</td>
                            <td>{transaction.cryptocurrency.name}</td>
                            <td>{transaction.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionHistory;
