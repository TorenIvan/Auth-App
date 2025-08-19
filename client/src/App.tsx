import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config';
import { ThemeProvider } from './store';
import { AxiosInterceptor, Toast } from './components';
import indexRouter from './routes';
import './App.css';

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AxiosInterceptor>
          <div className="screen-container">
            <RouterProvider router={indexRouter()} />
          </div>
        </AxiosInterceptor>
        <Toast />
      </ThemeProvider>
      {import.meta.env.VITE_NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} panelPosition="right" />
      ) : undefined}
    </QueryClientProvider>
  );
};

export default App;
