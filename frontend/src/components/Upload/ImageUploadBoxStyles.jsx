const styles = {
    uploadBox: {
        position: 'relative',
        height: 100,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '5px',
        padding: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
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
    previewsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '10px',
        width: '100%',
    },
    imagePreviewContainer: {
        position: 'relative',
        width: '100px',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '8px',
        marginRight: '8px',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '5px',
    },
    closeButton: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        padding: '2px',
        '&:hover': {
            color: 'rgba(255, 0, 0, 0.8)',
        },
    },
    coverText: {
        position: 'absolute',
        bottom: '2px',
        left: '2px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        borderRadius: '3px',
        padding: '2px 4px',
        fontSize: '12px',
    },
};

export default styles;
