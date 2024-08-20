import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Paper } from '@mui/material';
import { styled } from '@mui/system';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom fonts must be defined in the Quill editor to be used
const fonts = [
    'Roboto', 'Lobster', 'Merriweather', 'Open Sans', 'Raleway'
];
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = fonts;
ReactQuill.Quill.register(Font, true);

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .quill': {
        minHeight: '300px',
        maxHeight: '800px',
        overflow: 'auto',
        '& .ql-container': {
            minHeight: '300px',
            maxHeight: '800px',
        },
    },
}));

const DescriptionEditor = ({ label, value, onChange, ...props }) => {
    const [editorState, setEditorState] = useState(value || '');

    const handleEditorChange = (content, delta, source, editor) => {
        setEditorState(content);
        onChange(editor.getHTML());
    };

    return (
        <Box>
            <StyledFormControl fullWidth variant="outlined" {...props}>
                <InputLabel shrink>{label}</InputLabel>
                <Box
                    component={Paper}
                    variant="outlined"
                    sx={{
                        padding: '16.5px 14px',
                        minHeight: '200px',
                        maxHeight: '800px',
                    }}
                >
                    <ReactQuill
                        value={editorState}
                        onChange={handleEditorChange}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            ],
                        }}
                        formats={[
                            'header', 'font', 'list', 'bullet',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'link', 'image', 'align',
                        ]}
                    />
                </Box>
            </StyledFormControl>
        </Box>
    );
};

export default DescriptionEditor;


