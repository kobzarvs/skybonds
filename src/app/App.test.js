import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import App from './App';
import { store } from '../store';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
    /** Put your mantine theme override here */
});


jest.mock('echarts-for-react', () => {
    return {
        __esModule: true,
        default: () => {
            return <div>Mocked ReactECharts</div>;
        },
    };
});

jest.mock('@observablehq/inspector', () => {
    return {
        __esModule: false,
        default: () => {
            return <div>Mocked Inspector</div>;
        },
    };
});

describe('App', () => {
    xit('renders learn react link', () => {
        const result = renderer.create(
            <Provider store={store}>
                <MantineProvider theme={theme}>
                    <App/>
                </MantineProvider>
            </Provider>,
        );
        const app = result.toJSON();
        expect(app).toMatchSnapshot();
    });
});
