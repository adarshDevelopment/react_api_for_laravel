import { createContext, useEffect, useState } from "react";
import { Toaster } from "sonner";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function getUser() {
        try {
            const res = await fetch('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            Toaster.error('Problem connecting to the server');
            setUser(null);
        } finally {
            setLoading(false); // Ensure loading is set to false after fetching is complete
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        // Render nothing or a loader while fetching user data
        return <div>Loading...</div>;
    }

    return (
        <AppContext.Provider value={{ token, setToken, user, loading }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
