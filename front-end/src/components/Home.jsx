import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export default function BasicTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the users when the component mounts
    axios.get('http://localhost:8000/api/users')  // Adjust the URL to point to your backend's endpoint
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);  // The empty dependency array means this useEffect will run once when the component mounts

  const handleEdit = (userId) => {
    // For now, we'll just log the user's ID.
    // Later on, you might want to redirect to an edit page using something like React Router.
    console.log(`Redirecting to edit page for user with ID: ${userId}`);
  };
  
  const handleDelete = async (userId) => {
    try {
      // Assuming your backend is set up to handle DELETE requests at this endpoint
      axios.defaults.withCredentials = true;
      await axios.delete(`http://localhost:8000/api/users/${userId}`);
      
      // If successful, remove the user from the UI list
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);  // Assuming you have users in a state and a setUsers function to update it.
  
      console.log(`User with ID: ${userId} deleted successfully`);
    } catch (error) {
      console.log(error);
      // console.error(`Error deleting user with ID: ${userId}. Error: ${error}`);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">User Type</TableCell>
            <TableCell align="right">Portfolio</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{user.name}</TableCell>
              <TableCell align="right">{user.email}</TableCell>
              <TableCell align="right">{user.usertype}</TableCell>
              <TableCell align="right">{user.portfolio}</TableCell>
              <TableCell align="center">
                <Button variant="outlined" color="primary" onClick={()=>handleEdit(user.id)}>Edit</Button>
                <Button variant="outlined" color="secondary" onClick={()=>handleDelete(user.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
