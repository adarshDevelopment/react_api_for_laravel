import React, { useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'

function Layout() {

    const { user, setUser, token, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const logoutForm = async (e) => {
        e.preventDefault();
        console.log('inside logout Form');
        console.log(token);
        const res = await fetch('/api/logout', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            console.log('data.success working');
            localStorage.removeItem('token');
            // setUser(null);
            setToken('');
            navigate('/');
        }

    }

    return (
        <>

            <div className='flex flex-col h-screen'>


                <header className=' bg-[#1d293a] text-white'>

                    <div className='flex justify-between container mx-auto items-center '>

                        {/* left and right nav links  */}

                        <div className=''>
                            <nav className=' mx-auto py-5 px-5 '>
                                <Link to={"/"} className='hover:bg-slate-600 p-2 rounded-md'> Home</Link>

                            </nav>
                        </div>

                        {user ?
                            <div className='flex items-center gap-5'>
                                <div className='flex items-center gap-5'>
                                    {user.name}
                                </div>

                                <div className='flex items-center gap-5 '>
                                    <form onSubmit={(e) => { logoutForm(e) }} className='hover:bg-slate-600 p-2 rounded-md cursor-pointer'>
                                        <button>Log Out</button>
                                    </form>
                                </div>
                            </div>
                            : <div className='flex items-center gap-5'>
                                <nav className=' py-5 '>
                                    <Link to={"/register"} className='hover:bg-slate-600 p-2 rounded-md'> Register</Link>
                                </nav>
                                <nav className=' py-5  '>
                                    <Link to={"/login"} className='hover:bg-slate-600 p-2 rounded-md'> Login</Link>
                                </nav>

                            </div>
                        }

                    </div>


                </header>

                <main className='container mx-auto px-5 mt-3 flex-grow my-auto'>
                    <Outlet />

                </main >

            </div>


        </>
    )
}

export default Layout