import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Home = () => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        // Fetch users when component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users'); // adjust this endpoint as per your API
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        // Create user logic
        try {
            await axios.post('/api/users', formData); // adjust this endpoint as per your API
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Update user logic
        try {
            await axios.put(`/api/users/${currentId}`, formData); // adjust this endpoint as per your API
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleEdit = (user) => {
        setFormData({ name: user.name, email: user.email, address: user.address });
        setCurrentId(user.id);
        setEditing(true);
    };

    const handleDelete = async (id) => {
        // Delete user logic
        try {
            await axios.delete(`/api/users/${id}`); // adjust this endpoint as per your API
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="bg-gray-100 p-8">
            <form onSubmit={editing ? handleUpdate : handleCreate} className="bg-white shadow-md rounded p-6">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Name
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name"
                        value={formData.name} 
                        onChange={handleFormChange} 
                        placeholder="Name"
                        className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email"
                        value={formData.email} 
                        onChange={handleFormChange} 
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                    </label>
                    <textarea 
                        name="address" 
                        id="address"
                        value={formData.address} 
                        onChange={handleFormChange} 
                        placeholder="Address"
                        className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mt-4">
                    <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none">
                        {editing ? "Update" : "Create"} User
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Users</h2>
                {users.map(user => (
                    <div key={user.id} className="bg-white shadow-md rounded p-6 mb-4">
                        <p className="mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
                        <p className="mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
                        <p className="mb-4"><span className="font-semibold">Address:</span> {user.address}</p>
                        <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600 focus:outline-none">
                            Edit
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

