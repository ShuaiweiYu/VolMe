import React, {useState} from "react";
import {Box, Collapse, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";


const FilterItem = ({title, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ListItem sx={{
            fontSize: '1em',
            cursor: 'pointer',
            color: '#555',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            width:'100%',
            padding:0
        }}>
            <ListItemButton sx={{alignItems: 'left', width:'100%',padding:0}} onClick={() => setIsOpen(!isOpen)}>
                <Typography variant="body1">{isOpen ? '-' : '+'}</Typography>
                <ListItemText primary={title}/>
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    padding:0
                }}>
                    {children}
                </Box>
            </Collapse>
        </ListItem>
    );
};

export default FilterItem