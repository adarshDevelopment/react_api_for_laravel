import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'

const Home = () => {

    const { user } = useContext(AppContext);


    return (
        <>
            <div className='text-center text-3xl font-semibold'>Latest Posts</div>
            <h1>Welcome {user? user.name : 'Guest'}</h1>
        </>
    )
}

export default Home