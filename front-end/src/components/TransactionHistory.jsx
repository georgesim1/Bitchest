import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await axios.get('http://localhost:8000/api/transactions');
                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    console.error("Unexpected data format from API:", response.data);
                    setTransactions([]);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
            }
        }

        fetchTransactions();
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 200 }} aria-label="transaction table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Type</StyledTableCell>
                            <StyledTableCell>Time</StyledTableCell>
                            <StyledTableCell>Crypto</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <StyledTableRow key={transaction.id}>
                                <StyledTableCell>{transaction.transaction_type}</StyledTableCell>
                                <StyledTableCell>{new Date(transaction.created_at).toLocaleString()}</StyledTableCell>
                                <StyledTableCell>{transaction.cryptocurrency.name}</StyledTableCell>
                                <StyledTableCell>{transaction.amount}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TransactionHistory;
