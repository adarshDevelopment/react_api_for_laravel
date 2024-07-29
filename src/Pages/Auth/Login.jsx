import React, { useContext, useState } from 'react'
import { AppContext } from '../../Context/AppContext'
import { useNavigate } from 'react-router-dom'

const labelClasses = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white'
const inputClasses = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'

const Login = () => {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        {
            email: '',
            password: ''
        });

    const [errors, setErrors] = useState({});

    const handleSubmission = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/login', {
            method: "post",
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
        }

        if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            navigate('/');
        }
        else {


            // console.log('data from login page: ', data)

        }
    }
    return (
        <>
            <div className='m-auto h-full '>

                <div className='text-center text-3xl font-semibold'>Log In</div>
                <form onSubmit={handleSubmission} className="max-w-sm mx-auto flex flex-col m-auto bg-red">

                    <div className="mb-5">
                        <label htmlFor="email" className={labelClasses}>Your email</label>
                        <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="text" id="email" className={inputClasses} placeholder="name@flowbite.com" />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="name" className={labelClasses}>Password</label>
                        <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="text" id="password" className={inputClasses} placeholder='Password' />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

                    </div>


                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Log In
                    </button>
                </form>
            </div>
        </>


    )
}

export default Login