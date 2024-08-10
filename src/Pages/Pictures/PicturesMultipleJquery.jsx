import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const inputClasses = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '

function PicturesMultipleJquery() {

    const { token } = useContext(AppContext);

    // const [picture, setPicture] = useState();
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [errors, setErrors] = useState({});

    const [pictures, setPictures] = useState({});

    const [hidden, setHidden] = useState(-1);

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {
            var formData = new FormData();
            formData.append('title', title);
            // formData.append('image', picture);

            for (let i = 0; i < files.length; i++) {
                formData.append(`images[${i}]`, files[i]);

            }

            var response = await axios.post('http://127.0.0.1:8000/api/pictures_multiple', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Pciture successfully posted');
            setTitle('');
            document.getElementById('fileInput').value = '';

            await fetchPictures();
        } catch (e) {
            if (e.response.status === 422) {
                setErrors(e.response.data.errors);
                // console.log('errors: ', errors);
                // console.log(e.response.data);
            }
            toast.error('Something went wrong from. Please Try again.');

        }

    }

    const handleOnChnageFile = (e) => {
        // setPicture(e.target.files[0]);
        setFiles(e.target.files);
        // console.log('files: ', e.target.files);
    }
    var fetchPictures = async () => {
        try {
            var response = await axios.get('http://127.0.0.1:8000/api/pictures', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setPictures(response.data.pictures);
        } catch (e) {
            toast.warining(e);
            // toast.warning('Error fetching Pictures');

        }
    }

    const confirmDelete = (id) => {
        confirm('Are you sure you wnat to delete this picture?');
        const deletePicture = async () => {
            try {
                var response = await axios.delete(`http://127.0.0.1:8000/api/pictures/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })

                const status = response.status;
                if (status === 200) {
                    toast.success('Picture successfully deleted!');
                } else if (status === 404) {
                    toast.error('Picture not found!');
                }

                await fetchPictures();


            } catch (e) {
                toast.error('Something went wrong. Please try again.');
            }
        }

        if (confirm) {
            deletePicture();
        } else {
            return;
        }

    }

    useEffect(() => {
        fetchPictures();
    }, []);
// same photo getting uploaded while uplaoding image
// error deleting photos after setting up multiple images insertion


    return (
        <div className='flex flex-col items-center h-full '>
            <div className=''>
                <div >
                    Pictures
                </div>

                <div className='mt-20'>
                    <form onSubmit={handleSubmitForm}>
                        <input type="file" id='fileInput' onChange={handleOnChnageFile} multiple />
                        <input value={title} type="text" name='title' onChange={(e) => setTitle(e.target.value)} className='border border-gray-300 ' />
                        <button className='bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-white'>Upload</button>
                    </form>
                </div>
            </div>

            {/* image */}
            <div className='flex-grow p-5 lg:w-[80%] w-[90%] mx-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                    {pictures.length > 0
                        ? pictures.map((picture) => (
                            <div key={picture.id} onMouseEnter={() => setHidden(picture.id)} onMouseLeave={() => setHidden(-1)} className='relative w-full h-60 md:h-72 lg:h-80 shadow-xl'>

                                {/* id: {picture.id}
                                <br />
                                hidden Id: {hidden} */}
                                {picture.file_name} 
                                <button onClick={() => confirmDelete(picture.id)}
                                    className={hidden === picture.id ?
                                        'absolute top-2 right-2 text-gray-400 hover:text-gray-500 text-lg hover:text-xl'
                                        : 'absolute top-2 right-2 text-gray-400 hover:text-gray-500 text-lg hover:text-xl hidden'
                                    }>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                                <img
                                    className='w-full h-full object-contain shadow-xl p-2'
                                    // src='https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg'
                                    src={picture.url}
                                    alt={picture.title}
                                />
                            </div>
                        )
                        )
                        : (<p>No pictures found</p>)
                    }
                </div>
            </div>


        </div>
    )
}

export default PicturesMultipleJquery