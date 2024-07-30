import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'


const labelClasses = 'block mb-2 text-sm font-medium text-gray-900'
const inputClasses = ' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '

const Register = () => {

    const navigate = useNavigate();
    const { token, setToken } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});

    async function handleSubmission(e) {
        e.preventDefault();

        const res = await fetch('/api/register',
            {
                method: "post",
                body: JSON.stringify(formData),
            }
        );

        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
            // console.log('errors found!');
        }
        if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            navigate('/');
            // console.log('data: ', data);
        }

    }

    return (


        <>
            <div className='m-auto h-full'>

                <div className='text-center text-3xl font-semibold'>Register page</div>
                <form onSubmit={handleSubmission} className="max-w-sm mx-auto flex flex-col m-auto bg-red">
                    <div className="mb-5">
                        <label htmlFor="name" className={labelClasses}>Name</label>
                        <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" id="name" className={inputClasses} placeholder='Name' />
                        {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className={labelClasses}>Your email</label>
                        <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="text" id="email" className={inputClasses} placeholder="name@flowbite.com" />
                        {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}

                    </div>

                    <div className="mb-5">
                        <label htmlFor="name" className={labelClasses}>Password</label>
                        <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="text" id="password" className={inputClasses} placeholder='Password' />
                        {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}

                    </div>

                    <div className="mb-5">
                        <label htmlFor="name" className={labelClasses}>Confirm Password</label>
                        <input onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} type="text" id="name" className={inputClasses} placeholder='Confirm Password' />
                        {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation[0]}</p>}

                    </div>

                    <div className="flex items-start">

                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Register
                    </button>
                </form>
            </div>
        </>

    )
}

export default Register