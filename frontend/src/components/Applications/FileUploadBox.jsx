import * as React from 'react';

import SvgIcon from '@mui/material/SvgIcon';
import {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import {Box, Stack, Button, ListItemText, ListItem, List} from "@mui/material";
import {upload, validateFile} from "../../util/fileUploaderWrapper";
import {useCreateApplicationMutation, useDeleteApplicationMutation} from "../../redux/applications/applicationApiSlice";
import {useCreateDocumentMutation, useDeleteDocumentMutation} from "../../redux/documents/documentApiSlice"
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import {v4 as uuidv4} from 'uuid';


const styles = {
    uploadSection: {
        marginBottom: '20px',
    },
    visuallyHiddenInput: {
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        bottom: '0',
        left: '0',
        whiteSpace: 'nowrap',
        width: '1px',
    },
};

export default function FileUploadBox({
                                          onURLChange,
                                          onFileDelete,
                                          presentedFiles,
                                          requiredFileType,
                                          uploadButtonDescription = "Choose a file or drag it here",
                                      }) {
    const [tempFiles, setTempFiles] = useState([])// save the uploaded files at first.

    const onDrop = useCallback(async acceptedFiles => {
                const newFiles = acceptedFiles.map(file => ({
                    file: file,
                    name: file.name,
                    type: file.type,
                    requiredFileType:requiredFileType,
                    id: uuidv4()
                }));

                setTempFiles(prevTempFiles => {
                    const updatedFiles = [...prevTempFiles, ...newFiles]
                    return updatedFiles
                });

                const updatedFiles = [...presentedFiles, ...newFiles];
                onURLChange(updatedFiles);
            }
            ,
            [presentedFiles, onURLChange]
        )
    ;

    const  handleDelete = async (id) => {
        setTempFiles(prevTempFiles => {
                const temp = prevTempFiles.filter(file => file.id !== id)
                return temp
            }
        );
        await onFileDelete(id);
    };

    const {
        getRootProps,
        acceptedFiles,
        getInputProps,
        isDragActive,
    } = useDropzone({onDrop});

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };


    return (
        <Stack direction='column'>
            <Box {...getRootProps()}
                 sx={{
                     height: 200,
                     width: 200,
                     cursor: "pointer",
                     border: '1px solid',
                     borderColor: "divider",
                     borderRadius: '5px',
                     padding: '20px',
                     textAlign: 'center',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                 }}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <HourglassTopIcon size="large"/>
                ) : (
                    <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                        startDecorator={
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
                        <input type="file" style={styles.visuallyHiddenInput}/>
                    </Button>
                )}
            </Box>
            {tempFiles.length > 0 && (
                <Box sx={{marginTop: '20px'}}>
                    <List>
                        {tempFiles.map(file => (
                            <ListItem key={file.id} sx={{width: '200'}} secondaryAction={


                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.id)}>
                                    <DeleteIcon/>
                                </IconButton>

                            }>
                                <ListItemText primary={truncateText(file.name, 18)}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Stack>
    );
}