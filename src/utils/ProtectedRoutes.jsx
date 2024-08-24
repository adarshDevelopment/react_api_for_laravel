import React from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import BlankPage from '../Pages/BlankPage';

function ProtectedRoutes() {

    const { user, loading } = useContext(AppContext);

    if (loading) {
        return <BlankPage />
    }

    return user ? <Outlet /> : <Navigate to='/login' />

}

export default ProtectedRoutes