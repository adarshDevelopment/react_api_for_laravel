import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import { Link } from 'react-router-dom';

const Home = () => {

    const { user, token } = useContext(AppContext);
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const res = await fetch('/api/posts', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            setPosts(data);
        }
        setPosts(data.posts);
    }

    useEffect(() => {
        getPosts();
    }, []);


    return (
        <>
            <div className='text-center text-3xl font-semibold mb-5'>Latest Posts</div>
            {/* <h1>Welcome {user ? user.name : 'Guest'}</h1> */}

            <div className='flex flex-col gap-3'>

                {posts.length > 0 ? (
                    posts.map((post) =>

                    (
                        <div key={post.id} className=' flex flex-row justify-between items-start border-dotted border flex-1 p-2'>


                            <div className=' border-black p-2 '>
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

                            <div className='p-3 flex-shrink-0'>

                                <Link to={`/posts/${post.id}`}
                                    className='bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1'>
                                    Read More
                                </Link>
                            </div>

                        </div>
                    )
                    )

                ) : (<>There are no posts</>)}
            </div>

        </>
    )
}

export default Home