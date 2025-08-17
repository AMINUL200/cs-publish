import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { Provider } from "react-redux";
import { persistor, store } from "./app/store.js";
import { PersistGate } from 'redux-persist/integration/react';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PersistGate>
    </Provider>
  </React.StrictMode>
);
