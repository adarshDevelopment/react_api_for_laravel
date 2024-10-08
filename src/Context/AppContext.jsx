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
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data);
            } else {
                setUser(null);
            }

        } catch (error) {
            console.error('Failed to fetch user: ', error);
            Toaster.error('Problem connecting to the server');
            setUser(null);
        } finally {
            setLoading(false);
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

    return (
        <AppContext.Provider value={{ token, setToken, user, loading }}>
            {/* returningg children props passed as function parameter */}
            {children}
        </AppContext.Provider>
    );
};
export default AppProvider;