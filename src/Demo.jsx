// Simulating a dropzone setup
function useDropzone(options) {
    // const onDrop = options.onDrop
    const { onDrop } = options;

    // Simulate some properties returned by useDropzone
    // this function return the objects 
    const getRootProps = () => ({
        onDragOver: handleDragOver,
        onDrop: handleDrop
    });

    const getInputProps = () => ({
        type: 'file'
    });

    const isDragActive = false;

    // Handlers for drag events
    function handleDragOver(event) {
        event.preventDefault();
        console.log('Dragging over...');
    }

    function handleDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        onDrop(files);  // Call the onDrop function provided in the options
    }

    return { getRootProps, getInputProps, isDragActive };
}

// Example usage of the above function in plain JavaScript
const onDrop = (acceptedFiles) => {
    console.log('Files dropped:', acceptedFiles);
};

const { getRootProps, getInputProps } = useDropzone({ onDrop });

// Simulating a drag-and-drop action
const dropzoneElement = document.createElement('div');
const inputElement = document.createElement('input');

const rootProps = getRootProps();
dropzoneElement.addEventListener('dragover', rootProps.onDragOver);
dropzoneElement.addEventListener('drop', rootProps.onDrop);

const inputProps = getInputProps();
Object.assign(inputElement, inputProps);

// Append elements to the DOM for demonstration
document.body.appendChild(dropzoneElement);
document.body.appendChild(inputElement);


const A = { a1: 12, a2: 34, b: 'hello world' }
const b = A;