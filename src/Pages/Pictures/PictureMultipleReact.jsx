import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';

const inputClasses = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '

function PictureMultipleReact() {

    const { token } = useContext(AppContext);

    const [title, setTitle] = useState('');
    const [errors, setErrors] = useState('default error message');
    const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);


    const [pictures, setPictures] = useState({});

    const [hidden, setHidden] = useState(-1);

    // Submit form
    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {

            var formData = new FormData();
            formData.append('title', title);

            inputs.map((input, index) => {
                // console.log(input[0]);

                console.log(input.file);
                // console.log(input.file);
                // console.log('index: ' +index);
                formData.append(`images[${index}]`, input.file)
            })

            var response = await axios.post('http://127.0.0.1:8000/api/pictures_multiple', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Pciture successfully posted');


            setTitle('');
            setInputs([{}]);
            await fetchPictures();
        } catch (e) {
            if (e.response.data.message) {
                setErrors(e.response.data.message);
                toast.error(errors);

            } else {

                toast.error('Something went wrong. Please try again');
            }
        }

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
            toast.error(e);
            // toast.warning('Error fetching Pictures');

        }
    }

    //  Delete form 
    const confirmDelete = (id) => {
        const result = confirm('Are you sure you wnat to delete this picture?');
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

        if (result) {
            deletePicture();
        } else {
            return;
        }

    }


    // add fields

    const addInputFields = (e) => {
        e.preventDefault();
        setInputs([...inputs, { id: Date.now(), file: null }]);
    }

    const removeItems = (e, id) => {
        console.log(inputs);
        console.log('id: ' + id);
        e.preventDefault();
        setInputs(inputs.filter(input => input.id !== id));
    }

    const handleChange = (e, id) => {
        // add file to setInputs array as object
        var file = e.target.files[0];

        setInputs(
            inputs.map(
                input => input.id === id
                    ? { ...input, file: file }
                    : input
            )
        )

    }

    useEffect(() => {
        fetchPictures();
    }, []);


    return (
        <div className='flex flex-col items-center h-full '>
            <div className=''>
                <div >
                    Pictures
                </div>
                {/* Upload Form  */}
                <div className='mt-20'>
                    <form className='flex flex-col items-center justify-center gap-' id='form_multiple2'>
                        <div className='flex items-start gap-5 '>
                            {/* <input type="file" id='fileInput' onChange={handleOnChnageFile} multiple /> */}
                            <input value={title} type="text" name='title' onChange={(e) => setTitle(e.target.value)} className='border border-gray-300 ' />


                            <button className='bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-white' onClick={handleSubmitForm}>Upload</button>

                            <button className='bg-green-500 hover:bg-green-600 px-2 py-1 rounded-md text-white' onClick={addInputFields}>Add Pictures</button>
                            <div className='flex flex-col gap-3'>

                                {
                                    inputs.map((input) => (
                                        <div key={input.id}>
                                            <input
                                                key={input.id}
                                                type="file"
                                                id={`fileInput-${input.id}`}
                                                onChange={(e) => handleChange(e, input.id)}
                                                value={input.value}
                                            />
                                            {inputs.length > 1 ? (<button className='bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md text-white' onClick={(e) => removeItems(e, input.id)}>Remove </button>) : ''}

                                        </div>
                                    ))
                                }


                            </div>

                        </div>

                    </form>
                </div>
            </div>

            {/* Image List */}
            <div className='flex-grow p-5 lg:w-[80%] w-[90%] mx-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                    {pictures.length > 0
                        ? pictures.map((picture) => (
                            <div key={picture.id} onMouseEnter={() => setHidden(picture.id)} onMouseLeave={() => setHidden(-1)} className='relative w-full h-60 md:h-72 lg:h-80 shadow-xl'>

                                {/* id: {picture.id}
                                <br />
                                hidden Id: {hidden} */}
                                {picture.picture_main.title}
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

export default PictureMultipleReact