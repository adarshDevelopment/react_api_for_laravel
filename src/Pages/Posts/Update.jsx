import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';


function Update() {

    const { token, user } = useContext(AppContext);
    const id = useParams().id;

    const fetchPost = async () => {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json();

        if (res.ok) {
            if (user.id !== data.post.user_id) {
                navigate('/');
            }
            setFormmData({ 'title': data.post.title, 'body': data.post.body });
        }

    }

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
        fetchPost();
    }, []);

    const updateForm = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/posts/${id}`, {
            method: 'put',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json();

        console.log(data);
        if (res.ok) {
            navigate(`/posts/${id}`);
            toast.success(data.msg);

        } else {
            setErrors(data.errors);
            console.log(data);
        }
    }

    return (
        <>
            <div className='flex flex-col items-center h-full '>
                <h1 className='p-2 text-xl font-semibold'>Update Post</h1>

                <div className='flex flex-col w-full flex-grow  p-4'>
                    <form onSubmit={updateForm} className=' flex flex-col flex-grow gap-5 justify-center  w-full'>
                        <div>
                            <input onChange={(e) => setFormmData({ ...formData, title: e.target.value })} value={formData.title} className='w-full p-2 border border-gray-300 rounded' type="text" placeholder='TItle' />
                            <p className='text-red-500 text-sm'>{errors ? errors.title[0] : ''}</p>
                        </div>

                        <div className={`flex-grow ${errors.body ? 'mb-2' : ''}`}>
                            <textarea onChange={(e) => setFormmData({ ...formData, body: e.target.value })} value={formData.body} className='flex-grow p-2 border border-gray-300 rounded w-full h-full' name="" id="" placeholder='Post Content'>
                            </textarea>
                            <p className='text-red-500 text-sm'>{errors ? errors.body[0] : ''}</p>
                        </div>


                        <button className='bg-blue-600 rounded-md py-2 text-white hover:bg-blue-700'>Update Post</button>

                    </form>
                </div>
            </div>


        </>
    )
}

export default Update