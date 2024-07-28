import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ImageUploadBoxStyles';

const ImagePreview = React.forwardRef(({ preview, index, isEditing, getFileUrl, handleRemoveImage, provided }, ref) => (
    <Box
        ref={ref}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        sx={styles.imagePreviewContainer}
    >
        {index === 0 && (
            <Typography variant="caption" sx={styles.coverText}>
                Cover
            </Typography>
        )}
        <img
            src={isEditing ? getFileUrl(preview, "icon", "default") : preview}
            alt="preview"
            style={styles.imagePreview}
        />
        <IconButton
            size="small"
            sx={styles.closeButton}
            onClick={() => handleRemoveImage(index)}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    </Box>
));

export default ImagePreview;
