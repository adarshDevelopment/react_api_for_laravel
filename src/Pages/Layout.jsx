import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'

function Layout() {

    const { user } = useContext(AppContext);


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

                        {user ? user.name
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