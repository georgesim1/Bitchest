import React, { useState, useContext } from 'react';
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Update the import statement to use the named export
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");  // State for error messages
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMsg("");  // Clear any existing error messages

        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/login', { email, password });
            
            if (response.status === 200 && response.data.success) {  // Check response data for a success flag
                login();
                navigate("/");
            } else {
                console.error("Login failed");
                setErrorMsg(response.data.message || "Login failed."); // Display server message or default
            }

            setEmail("");
            setPassword("");
        } catch (e) {
            console.error("Error during login:", e);
            setErrorMsg(e.response?.data?.message || "An error occurred during login.");  // Log and display the error
        }
    }
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-grey rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-emerald-500">
                   Sign in
                </h1>
                <form onSubmit={handleLogin}
                className="mt-6">
                    <div className="mb-2">
                       
                        <label
                            type="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={ (e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            type="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={ (e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-emerald-500 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                            Login
                        </button>
                    </div>
                    
                </form>
                 {/* Display error messages */}
                 {errorMsg && <div className="text-red-500 mb-4">{errorMsg}</div>}
            </div>
        </div>
  )
}

export default Login