import React, { useContext, useState } from 'react'
import { AppContext } from '../../Context/AppContext';

const inputClasses = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '

function Index() {

    const { token } = useContext(AppContext);

    const [picture, setPicture] = useState();
    const [title, setTitle] = useState('');

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        // const formData = new FormData({
        //     'title': title,
        //     'image': picture
        // });

        // console.log('title: ', title);

        try {
            var formData = new FormData();
            if (picture) {
                formData.append('image', picture);
            }
            console.log('file: ', formData.get('image'))

            formData.append('title', title);

            const res = await fetch('/api/demo', {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                // body: formData
                body: JSON.stringify({ 'title': title , 'image': picture})
            });

            // const res = await fetch('/api/pictures/', {
            //     method: 'post',
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     },
            //     body: JSON.stringify({ 'title': title })
            // })

            const data = await res.json();

            console.log('picture: ', picture);


        } catch (e) {
            console.log(e);
        }

    }

    const handleOnChnageFile = (e) => {
        setPicture(e.target.files[0]);
        // console.log('files: ', e.target.files);
    }
    return (
        <div className='flex flex-col items-center h-full '>
            <div >
                Pictures
            </div>

            <div className='mt-20'>
                <form onSubmit={handleSubmitForm}>
                    <input type="file" onChange={handleOnChnageFile} />
                    <input type="text" name='title' onChange={(e) => setTitle(e.target.value)} className='border border-gray-300 ' />
                    <button className='bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-white'>Upload</button>
                </form>
            </div>
        </div>
    )
}

export default Index