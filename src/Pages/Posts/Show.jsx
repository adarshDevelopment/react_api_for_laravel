import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Show() {

    const id = useParams().id;
    const [post, setPost] = useState(null);

    const { user, token } = useContext(AppContext);

    const navigate = useNavigate();

    const fetchPost = async () => {

        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json();


        if (res.ok) {
            setPost(data.post);
        }
    }

    const deleteForm = async (e) => {
        e.preventDefault();
        console.log('inside delete Form');
        if (user && user.id !== post.user_id) {
            navigate('/');
        }
        // if (id !== user.id) {        // id from user params is post id not user_id
        //     navigate('/');
        //     return;
        // }
        const res = await fetch(`/api/posts/${id}`, {
            method: 'delete',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (res.ok) {
            toast.success(data.msg);
            navigate('/')
        }
    }


    useEffect(() => {
        fetchPost();
    }, [])

    // console.log('user: ', user);
    return (

        <div>

            {post ? (

                <div key={post.id} className=' flex justify-between items-center border-dotted border'>
                    <div className=' border-black p-2'>
                        <div>
                            <h1 className='text-xl font-semibold'>{post.title}</h1>
                            <p className='text-sm text-gray-500'>{post.body}</p>
                            <div className='flex gap-2 items-center'>
                                <span className='text-sm text-gray-500'> Created by:</span>
                                <span className='font-semibold'>
                                    {post.user.name}
                                </span>
                                {/* <span className='text-sm text-gray-500'> on {new Date(post.created_at).toLocaleTimeString}</span> */}

                            </div>


                        </div>

                    </div>


                    {
                        // user?.id === post.user_id && (
                        user && user.id === post.user_id && (

                            <div className='flex items-center p-3 gap-2'>
                                <div className=''>
                                    <Link to={`/posts/update/${id}`} className=' text-white font-semibold bg-green-500 px-3 py-1 rounded-md hover:bg-green-600'>Update</Link>

                                </div>

                                <div className=''>
                                    <form onSubmit={deleteForm}>
                                        <button className='text-white font-semibold bg-red-500 px-3 py-1 rounded-md hover:bg-red-600'>Delete</button>
                                    </form>

                                </div>
                            </div>


                        )
                    }




                </div>


            ) : (<div className='text-3xl font-bold mt-5 text-center'>Post not found!</div>)}

        </div>
    )
}

export default Show