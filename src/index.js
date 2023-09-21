import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MantineProvider, createTheme } from '@mantine/core';
import reportWebVitals from './reportWebVitals';
import { worker } from './mocks/browser';
import { store } from './store';
import App from './app/App';
import { createDataset } from './features/bond-card/db/bonds-factory';
import { initDB } from './features/bond-card/db/bonds-db';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';

// mock service worker
worker.start();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const theme = createTheme({
    /** Put your mantine theme override here */
});

initDB().then(async () => {
    await createDataset(false);

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <Provider store={store}>
            <MantineProvider theme={theme}>
                <App/>
            </MantineProvider>
        </Provider>,
    );
});
export { saveLsItem } from './utils/local-storage';
export { loadLsItem } from './utils/local-storage';
export { getBondsData } from './features/bonds-cache/services/get-bonds-data';
export { storage } from './features/bonds-cache/services/storage';
