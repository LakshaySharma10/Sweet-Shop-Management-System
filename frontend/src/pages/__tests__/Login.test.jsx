import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../Login';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

const renderLogin = () => {
    return render(
        <AuthProvider>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </AuthProvider>
    );
};

describe('Login Page', () => {
    it('renders login form', () => {
        renderLogin();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('handles successful login', async () => {
        const mockResponse = { data: { token: 'fake-token', user: { username: 'testuser' } } };
        axios.post.mockResolvedValueOnce(mockResponse);

        renderLogin();

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/auth/login/', {
                username: 'testuser',
                password: 'password123'
            });
        });
    });

    it('displays error on failed login', async () => {
        axios.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });

        renderLogin();

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});
