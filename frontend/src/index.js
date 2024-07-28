import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import store from './redux/store';
import './i18n';
import {ThemeProvider} from "@mui/material/styles";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {volmeTheme} from "./theme";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={volmeTheme}>
        <ToastContainer/>
          <Provider store={store}>
              <App />
          </Provider>
    </ThemeProvider>
);

// App.js or index.js (main entry point)
