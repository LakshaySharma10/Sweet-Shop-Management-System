import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('/api/auth/register/', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-300 text-slate-900">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transform transition-all">
                <h1 className="text-3xl font-light text-center mb-8">Create Account</h1>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-sm font-medium text-slate-600">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="johndoe"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-slate-600">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium text-slate-600">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirm_password" className="text-sm font-medium text-slate-600">Confirm Password</label>
                        <input
                            id="confirm_password"
                            type="password"
                            name="confirm_password"
                            placeholder="••••••••"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-slate-800 transition-colors mt-2"
                    >
                        Register
                    </button>
                    <p className="text-center text-sm text-slate-500 mt-4">
                        Already have an account? <a href="/login" className="text-black font-medium hover:underline">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
