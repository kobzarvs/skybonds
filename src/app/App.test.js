import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import App from './App';
import { store } from '../store';


jest.mock('echarts-for-react', () => {
    return {
        __esModule: true,
        default: () => {
            return <div>Mocked ReactECharts</div>;
        },
    };
});

test('renders learn react link', () => {
    const result = renderer.create(
        <Provider store={store}>
            <App/>
        </Provider>,
    );
    const app = result.toJSON();
    expect(app).toMatchSnapshot();
});
