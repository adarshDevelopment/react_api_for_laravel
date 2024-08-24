import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'sonner';
import Dropzone from './Dropzone'
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import { faTimes } from '@fortawesome/free-solid-svg-icons';



function PicturesDropzone() {
    const { token } = useContext(AppContext);

    const [pictures, setPictures] = useState({});

    const [hidden, setHidden] = useState(-1);

    var fetchPictures = async () => {
        try {
            var response = await axios.get('http://127.0.0.1:8000/api/pictures', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setPictures(response.data.pictures);
            console.log('pictures: ', pictures)
        } catch (e) {
            toast.error(e);
            console.log(e);
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

    useEffect(() => {
        fetchPictures();
    }, []);


    // drop zone
    const [files, setFiles] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [title, setTitle] = useState('');

    // this gets executed inside the hook on its own
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // Do something with the files
        // console.log(acceptedFiles);

        if (acceptedFiles?.length) {
            setFiles(previousFiles => {
                return [
                    ...previousFiles,
                    ...acceptedFiles.map(file =>
                        // adding preview property to all records. and creating URL
                        // {...file, {preview: URL.createObjectURL(file)}}
                        Object.assign(file, { preview: URL.createObjectURL(file) })
                    )
                ]
            })
        } else {
            setRejected(previousFiles => {
                return [
                    ...rejected,
                    // ...rejectedFiles.map(file => ({ ...rejected, ...{ preview: URL.createObjectURL(file) } }))
                    ...rejectedFiles
                ]
            })
        }
        // console.log(rejectedFiles);
    }, [])

    const removeFile = (name) => {
        setFiles(files.filter(file => file.name !== name))
    }

    const removeRejected = (name) => {
        console.log('name: ', name);
        // set new values and put everytyhing but the selected item
        setRejected(prevFiles => prevFiles.filter(({ file }) => file.name !== name))
        // console.log(rejected);
    }

    // expecting getRootProps.... variables from useDropzone function which also takes onDrop function
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDrop,
        accept: { 'image/*': [] },
        maxSize: 1024 * 1000,

    })



    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {

            if (!files?.length) {
                return;
            }

            var formData = new FormData();
            formData.append('title', title);

            files.forEach(file => formData.append('file', file));



            files.map((file, index) => {
                formData.append(`images[${index}]`, file);
            })
            /*
                title: index
                images[0]: (binary)
                images[1]: (binary)
            */
            var response = await axios.post('http://127.0.0.1:8000/api/pictures_multiple', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Pciture successfully posted');
            fetchPictures()
            setFiles([]);




            setTitle('');
            setInputs([{}]);
            await fetchPictures();
        } catch (e) {
            console.log(e);
            if (e.response.data.message) {
                setErrors(e.response.data.message);
                toast.error(errors);

            } else {

                toast.error('Something went wrong. Please try again');
            }
        }

    }
    return (
        <div>
            <span className='text-3xl text-blue-400 font-semibold'> Upload Files </span>


            {/* <Dropzone className='p-16 mt-5 border border-neutral-200' /> */}
            <div>
                {/*  SPREADS THE PROPERTIES of the function. getRoorProps returns {key:object} objects */}


                <form className=''>
                    <div {...getRootProps({
                        // adding objects to getRootProps which is later spread to the div
                        className: 'p-16 mt-5 border border-neutral-200'
                    })} >

                        <input {...getInputProps()} />



                        <div className='text-neutral-800'>
                            {
                                isDragActive ?
                                    <p>Drop the files here ...</p> :
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                            }
                        </div>

                    </div>

                    <div className='flex flex-col justify-between items-end gap-2 mt-3 mx-auto'>
                        <input className='border w-[100%] text-center pl-5 rounded-sm border-neutral-400 px-3 py-1 ' placeholder='Enter Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <button onClick={(e) => { handleSubmitForm(e) }} className='bg-blue-500 px-5 text-white hover:bg-blue-600 font-semibold py-1 rounded-sm '>Submit</button>

                    </div>

                </form>
                {/* Preview */}

                <div>
                    <div className='flex gap-3 flex-wrap mx-auto '>
                        {
                            files.map(file => (
                                <div key={file.name} className='relative mt-5 bg-neutral-100 shadow-lg rounded-lg flex items-center'>
                                    <FontAwesomeIcon
                                        className='text-neutral-500 absolute top-1 right-1 hover:text-red-400 cursor-pointer'
                                        icon={faTimes}
                                        onClick={() => { removeFile(file.name) }} />

                                    {/* <Image src={file.preview} /> */}
                                    {/* onLoad gets triggered when the image is done loading */}
                                    <img onLoad={() => URL.revokeObjectURL(file.preview)} src={file.preview} alt="" width={150} height={150} />
                                    {/* {file.name} */}
                                </div>
                            ))
                        }
                    </div>
                </div>


                <div className=''>
                    <div className='flex gap-3 flex-wrap mx-auto flex-col'>
                        {
                            rejected.map(({ file, errors }) => (
                                <div key={file.name} className='flex relative mt-5 bg-neutral-100 shadow-lg rounded-lg items-start justify-between items-start'>

                                    <div>
                                        <div>
                                            <p className='font-semibold text-md'>{file.name}</p>
                                        </div>

                                        <div className='text-red-500 text-sm'>
                                            {errors.map((error) => (<div key={error.code}>{error.message}</div>))}
                                        </div>

                                    </div>
                                    <div className='p-2'>
                                        <button
                                            onClick={() => removeRejected(file.name)}
                                            className='border border-red-300 rounded-lg px-2 py-0.5 bg-red-50 hover:bg-red-200'>Remove</button>
                                    </div>


                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>





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

export default PicturesDropzone