import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import store from './redux/store';
import './i18n';
import {ThemeProvider} from "@mui/material/styles";
import {volmeTheme} from "./theme";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {disableReactDevTools} from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === 'production') {
    disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={volmeTheme}>
        <ToastContainer/>
        <Provider store={store}>
            <App />
        </Provider>
    </ThemeProvider>
);
