import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
    username: string;
    roles: any[];
}

interface UserContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/me');
                setUser(response.data);
            } catch (error) {
                // Not authenticated
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
