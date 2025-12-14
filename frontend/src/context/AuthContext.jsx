import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
                return null;
            }
            return JSON.parse(savedUser);
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('access_token');
    });

    const login = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
