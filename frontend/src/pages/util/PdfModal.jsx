import React, { useState } from 'react';
import PdfPreviewer from './PdfPreviewer';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

const PdfModal = ({ title, file, renderMessage, enableDownload }) => {
    const [openModal, setOpenModal] = useState(false);

    const handleClose = (event, reason) => {
        setOpenModal(false);
    };

    return (
        <div>
            <Button
                onClick={() => setOpenModal(true)}
                sx={{
                    p: 1,
                    minWidth: 'auto',
                    backgroundColor: 'transparent',
                    border: 'none',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                    }
                }}
            >
                <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <PictureAsPdfIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography>{title}</Typography>
                </Paper>
            </Button>

            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openModal}
            >
                <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                    {title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent>
                    <PdfPreviewer pdfUrl={file} renderMessage={renderMessage} enableDownload={enableDownload}/>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PdfModal;

