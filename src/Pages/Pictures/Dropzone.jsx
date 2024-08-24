import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { toast } from 'sonner';


export default function Dropzone(props) {



    const [files, setFiles] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [title, setTitle] = useState('');
    const [errors, setErrors] = useState('default error message');

    const { token } = useContext(AppContext);


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
            {/*  SPREADS THE PROPERTIES of the function. getRoorProps returns {key:object} objects */}


            <form className=''>
                <div {...getRootProps({
                    // adding objects to getRootProps which is later spread to the div
                    className: props.className
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

    )
}


// function demo(b) {
//     const a = b + 10;
//     return a;
// }

// const { a } = demo(10);
// console.log(a);



// var list = { 1: 10, 2: 20, 3: 30 }
// var additional = { 4: 40 }
// var newList = { ...list, ...{ 5: 50 } }
// console.log(newList);
