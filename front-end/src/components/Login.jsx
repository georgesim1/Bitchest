import React, { useState, useEffect } from 'react';
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const inputStyles = "block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none focus:ring focus:ring-opacity-40";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const resetForm = () => {
        setEmail("");
        setPassword("");
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMsg("");

        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/login', { email, password });

            if (response.status === 200) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate(0); 
            } else {
                setErrorMsg(response.data.message || "Login failed.");
            }

            resetForm();
        } catch (e) {
            setErrorMsg(e.response?.data?.message || "An error occurred during login.");
        }
    }

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-grey rounded-md shadow-md lg:max-w-xl">
                {/* Display the logo */}
                <img src='/assets/bitchest_logo.png' alt="Logo" />
                
                <form onSubmit={handleLogin} className="mt-6">
                    <div className="mb-2">
                        <label className="block text-sm font-semibold text-gray-800">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputStyles} />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-semibold text-gray-800">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputStyles} />
                    </div>
                    <div className="mt-6">
                        <button type="submit" className=" w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600" 
                        style={{ backgroundColor: '#01ff19' }}>
                            Login
                        </button>
                    </div>
                </form>
                {errorMsg && <div className="text-red-500 mb-4">{errorMsg}</div>}
            </div>
        </div>
    )
}

export default Login;
