import {createTheme} from '@mui/material/styles';

export const green = {
    50: '#F6FEF6',
    100: '#E3FBE3',
    200: '#C7F7C7',
    300: '#A1E8A1',
    400: '#51BC51',
    450: '#5CBC63',
    500: '#1F7A1F',
    600: '#136C13',
    700: '#0A470A',
    800: '#042F04',
    900: '#021D02',
};

const colors = {
    background: "#FCFCF6",
    primary: green[450],
    secondary: green[500],
    text: {
        primary: "#FFF",
        secondary: "#000",
    }
};

export const volmeTheme = createTheme({
    palette: {
        primary: {
            main: colors.primary,
        },
        secondary: {
            main: colors.secondary,
        },
        background: {
            default: colors.background,
        }
    },

    zIndex: {
        appBar: 1200,
        drawer: 1100,
        modal: 1300,    // Modal (Dialog) component
        tooltip: 1500,
    },

    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.background,
                    color: colors.text.secondary,
                    borderRight: "none",
                },
            },
        },
        MuiButtonGroup: {
            styleOverrides: {
                root: {
                    color: colors.text.primary,
                    textTransform: "none",
                    borderRadius: '15px',
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    color: colors.primary,
                    textTransform: "none",
                    borderRadius: '15px',
                },
                contained: {
                    backgroundColor: colors.primary,
                    color: '#fff',
                    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                    '&:hover': {
                        backgroundColor: colors.secondary,
                    },
                },
                outlined: {
                    borderColor: colors.primary,
                    color: colors.primary,
                    '&:hover': {
                        backgroundColor: colors.secondary,
                        //borderColor: '#115293',
                    },
                },
            },
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                color: colors.text.secondary,
            },
        },
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: colors.secondary,
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: colors.background,
                color: colors.text.primary,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                color: colors.text.primary,
                backgroundColor: colors.background,
                textTransform: "none",
                borderRadius: '15px',
            },
            outlined: {
                color: colors.text.primary, // Custom border color for outlined buttons
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    '& fieldset': {
                        borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                        borderColor: 'divider',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'divider',
                    },
                },
            },
        },
    },
    MuiDialog: {
        styleOverrides: {
            root: {
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderRadius: '30px',  // Example border radius
            },
        },
    },
    MuiBadge: {
        styleOverrides: {
            badge: {
                fontFamily: 'Arial, sans-serif',
                fontSize: '1rem',
                fontWeight: 'regular',
            },
        },
    },

    typography: {
        fontFamily: {
            //primary: "PT Sans",
            //secondary: "Roboto",
        },
        h1: {
            fontFamily: 'PT Sans',
            fontSize: 30,
            fontWeight: 650,
        },
        h2: {
            fontFamily: 'PT Sans',
            fontSize: 25,
            fontWeight: 650,
        },
        h3: {
            fontFamily: 'PT Sans',
            fontSize: 20,
            fontWeight: 600,
        },
        h4: {
            fontFamily: 'PT Sans',
            fontSize: 15,
            fontWeight: 550,
        },
        h5: {
            fontFamily: 'PT Sans',
            fontSize: 20,
            fontWeight: 500,
        },
        h6: {
            fontFamily: 'PT Sans',
            fontSize: 17,
            fontWeight: 550,
        },
        h7: {
            fontFamily: 'Roboto',
        }
    },
});

export default volmeTheme;


