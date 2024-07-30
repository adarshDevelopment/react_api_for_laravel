import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Create() {

    const { token } = useContext(AppContext);

    const [formData, setFormmData] = useState({
        title: '',
        body: ''
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        title: '',
        body: ''
    })



    useEffect(() => {
        // console.log(token);
    }, [formData]);

    const submitFormData = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/posts', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json();

        console.log(data);
        if (res.ok) {
            setFormmData({})
            toast.success(data.msg);
            navigate('/');

        } else {
            setErrors(data.errors);
            console.log(data);
        }
    }

    return (
        <>
            <div className='flex flex-col items-center h-full '>
                <h1 className='p-2 text-xl font-semibold'>Create a new Post</h1>

                <div className='flex flex-col w-full flex-grow  p-4'>
                    <form onSubmit={submitFormData} className=' flex flex-col flex-grow gap-5 justify-center  w-full'>
                        <div>
                            <input onChange={(e) => setFormmData({ ...formData, title: e.target.value })} value={formData.title} className='w-full p-2 border border-gray-300 rounded' type="text" placeholder='TItle' />
                            <p className='text-red-500 text-sm'>{errors ? errors.title[0] : ''}</p>
                        </div>

                        <div className={`flex-grow ${errors.body ? 'mb-2' : ''}`}>
                            <textarea onChange={(e) => setFormmData({ ...formData, body: e.target.value })} value={formData.body} className='flex-grow p-2 border border-gray-300 rounded w-full h-full' name="" id="" placeholder='Post Content'>
                            </textarea>
                            <p className='text-red-500 text-sm'>{errors ? errors.body[0] : ''}</p>
                        </div>


                        <button className='bg-blue-600 rounded-md py-2 text-white hover:bg-blue-700'>Create Post</button>

                    </form>
                </div>
            </div>


        </>
    )
}

export default Create