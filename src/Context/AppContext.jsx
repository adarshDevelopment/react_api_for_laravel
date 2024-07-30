import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    async function getUser() {
        const res = await fetch('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (res.ok) {

            setUser(data);
        }
    }

    useEffect(() => {
        if (token) {
            // console.log('token from context: ', token)
            getUser();
        } else {
            setUser(null);
        }
    }, [token]);

    return (
        <AppContext.Provider value={{ token, setToken, user }}>
            {children}
        </AppContext.Provider>
    )
};
export default AppProvider;