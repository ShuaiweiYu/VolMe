import React, { useCallback, useEffect, useState } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { useDropzone } from 'react-dropzone';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { Box, Button } from '@mui/material';
import { getFileUrl, upload, validateFile } from '../../util/fileUploaderWrapper';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/auth/authSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useGetEventByIdQuery } from '../../redux/events/eventApiSlice';
import ImagePreview from './ImagePreview';
import styles from './ImageUploadBoxStyles';

const ImageUploadBox = ({ onURLChange, isEditing, eventID = null, applicationId = null, uploadButtonDescription = 'Choose a file or drag it here' }) => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const { data: event } = useGetEventByIdQuery(eventID);
    const userID = useSelector(selectCurrentUserId);

    useEffect(() => {
        if (isEditing && event) {
            const { uploadURL } = event.response;
            setImagePreviews(uploadURL);
            setImageUrls(uploadURL);
        }
    }, [isEditing, event]);

    const processFiles = useCallback(async (files) => {
        const newPreviews = [];
        const newUrls = [];

        const uploadPromises = files.map(file => (
            new Promise((resolve, reject) => {
                try {
                    validateFile(file);

                    const reader = new FileReader();
                    reader.onload = async () => {
                        const result = reader.result;
                        newPreviews.push(result);

                        try {
                            const url = await upload(file, 'image', userID);
                            newUrls.push(url);
                            resolve(url);
                        } catch (uploadError) {
                            console.error(uploadError);
                            toast.error('File upload failed.');
                            reject(uploadError);
                        }
                    };
                    reader.readAsDataURL(file);
                } catch (validationError) {
                    console.error(validationError);
                    toast.error('File validation failed.');
                    reject(validationError);
                }
            })
        ));

        try {
            await Promise.all(uploadPromises);
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setImageUrls(prev => [...prev, ...newUrls]);
            onURLChange(prev => [...prev, ...newUrls]);
        } catch (error) {
            console.error("Error in processing files: ", error);
        }
    }, [userID, onURLChange]);

    const onDrop = useCallback((acceptedFiles) => {
        processFiles(acceptedFiles);
    }, [processFiles]);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(imagePreviews);
        const urls = Array.from(imageUrls);
        const [reorderedItem] = items.splice(result.source.index, 1);
        const [reorderedUrl] = urls.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        urls.splice(result.destination.index, 0, reorderedUrl);

        setImagePreviews(items);
        setImageUrls(urls);
        onURLChange(urls);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleRemoveImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageUrls(prev => prev.filter((_, i) => i !== index));
        onURLChange(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files) {
            processFiles(Array.from(files));
        }
    };

    return (
        <>
            <Box sx={styles.uploadBox} {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <HourglassTopIcon size="large" />
                ) : (
                    <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                        startIcon={
                            <SvgIcon>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                    />
                                </svg>
                            </SvgIcon>
                        }
                    >
                        {uploadButtonDescription}
                        <input
                            type="file"
                            style={styles.visuallyHiddenInput}
                            onChange={handleFileChange}
                            multiple
                        />
                    </Button>
                )}
            </Box>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="imagePreviews" direction="horizontal">
                    {(provided) => (
                        <Box
                            sx={styles.previewsContainer}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {imagePreviews.map((preview, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={`image-${index}`}
                                    index={index}
                                >
                                    {(provided) => (
                                        <ImagePreview
                                            ref={provided.innerRef}
                                            preview={preview}
                                            index={index}
                                            isEditing={isEditing}
                                            getFileUrl={getFileUrl}
                                            handleRemoveImage={handleRemoveImage}
                                            provided={provided}
                                        />
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default ImageUploadBox;












