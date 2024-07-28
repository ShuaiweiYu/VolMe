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
            <StyledFormControl required fullWidth variant="outlined" {...props}>
                <InputLabel shrink>{label}</InputLabel>
                <Box
                    component={Paper}
                    variant="outlined"
                    sx={{
                        padding: '16.5px 14px',
                        minHeight: '200px',
                        maxHeight: '800px',
                        '& .ql-editor': {
                            fontFamily: 'Roboto, sans-serif',
                        },
                        '& .ql-editor h1': {
                            fontFamily: 'Lobster, cursive',
                        },
                        '& .ql-editor h2': {
                            fontFamily: 'Open Sans, sans-serif',
                        },
                        '& .ql-editor h3': {
                            fontFamily: 'Merriweather, serif',
                        },
                        '& .ql-editor h4': {
                            fontFamily: 'Raleway, sans-serif',
                        },
                    }}
                >
                    <ReactQuill
                        value={editorState}
                        onChange={handleEditorChange}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                [{ 'font': fonts }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                ['link', 'image'],
                                ['clean'],
                                [{ 'align': [] }],
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


