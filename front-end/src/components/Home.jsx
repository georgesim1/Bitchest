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
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import GroupIcon from '@mui/icons-material/Group';
import ActionIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';



export default function BasicTable() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [notification, setNotification] = useState({ message: '', severity: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8000/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUser = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post('http://localhost:8000/api/users', newUser);
      setUsers(prevUsers => [...prevUsers, response.data.user]);
      setNotification({ message: `User created successfully`, severity: 'success' });
      setOpenSnackbar(true);
      setShowForm(false);
      setNewUser({ name: '', email: '', password: '' });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleEditChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = async (userId) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.put(`http://localhost:8000/api/users/${userId}`, editedUser);
      const updatedUsers = users.map(user => user.id === userId ? response.data.user : user);
      setUsers(updatedUsers);
      setEditingId(null);
      setEditedUser({});
      setNotification({ message: `User updated successfully`, severity: 'success' });
      setOpenSnackbar(true);
    } catch (error) {
      console.error(`Error updating user with ID: ${userId}. Error: ${error}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      await axios.delete(`http://localhost:8000/api/users/${userId}`);
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setNotification({ message: `User deleted successfully`, severity: 'error' });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
 
      
{showForm && (
  <div style={{ marginTop: '20px', marginBottom: '20px'  }}>
      <TextField
          label="Name"
          value={newUser.name}
          onChange={e => handleInputChange('name', e.target.value)}
          margin="normal"
          fullWidth
          style={{ marginBottom: '20px' }}
      />
      <TextField
          label="Email"
          value={newUser.email}
          onChange={e => handleInputChange('email', e.target.value)}
          margin="normal"
          fullWidth
          style={{ marginBottom: '20px' }}
      />
      <TextField
          label="Password"
          type="password"
          value={newUser.password}
          onChange={e => handleInputChange('password', e.target.value)}
          margin="normal"
          fullWidth
          style={{ marginBottom: '20px' }}
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddUser} 
        style={{ marginRight: '10px' }}
      >
          Submit
      </Button>
  </div>
)}

<Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New User'}
      </Button>

      <TableContainer style={{ marginTop: '20px' }} component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>
                <PersonIcon style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Name
              </TableCell>
              <TableCell align="right">
                <EmailIcon style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Email
              </TableCell>
              <TableCell align="right">
                <GroupIcon style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                User Type
              </TableCell>
              <TableCell align="right">
                <ActionIcon style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {users.map((user) => (
    <TableRow key={user.id}>
      <TableCell component="th" scope="row">
        {editingId === user.id ? (
          <TextField
            value={editedUser.name}
            onChange={e => handleEditChange('name', e.target.value)}
          />
        ) : (
          user.name
        )}
      </TableCell>
      <TableCell align="right">
        {editingId === user.id ? (
          <TextField
            value={editedUser.email}
            onChange={e => handleEditChange('email', e.target.value)}
          />
        ) : (
          user.email
        )}
      </TableCell>
      <TableCell align="right">
        {editingId === user.id ? (
          <TextField
            color='green'
            value={editedUser.usertype}
            onChange={e => handleEditChange('usertype', e.target.value)}
          />
        ) : (
          user.usertype
        )}
      </TableCell>
      <TableCell align="right">
    {editingId === user.id ? (
        <Button onClick={() => handleEdit(user.id)}>Save</Button>
    ) : (
        <Button style={{ marginRight: '10px' }} onClick={() => startEdit(user)}>Edit</Button>  // <-- Added margin here
    )}
    <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDelete(user.id)}>Delete</Button>
</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </div>
  );
}
