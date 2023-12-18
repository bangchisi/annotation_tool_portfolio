import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css';
import reportWebVitals from './reportWebVitals';

import Annotator from 'routes/Annotator/Annotator';
import Auth from 'routes/Auth/Auth';
import Dataset from 'routes/Dataset/Dataset';
import Datasets from 'routes/Datasets/Datasets';
import Models from 'routes/Models/Models';
import App from './App';
import ErrorPage from './error';

import Authenticated from 'components/Authenticated';
import { Provider } from 'react-redux';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Playground from 'routes/_Playground';
import store from 'store';
import { TourProvider } from '@reactour/tour';
import { steps } from 'hooks/useOnboarding';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Navigate to="/datasets" />,
      },
      {
        path: '/datasets',
        element: (
          <Authenticated>
            <TourProvider steps={steps.datasets}>
              <Datasets />
            </TourProvider>
          </Authenticated>
        ),
      },
      {
        path: '/dataset/:datasetId',
        element: (
          <Authenticated>
            <Dataset />
          </Authenticated>
        ),
      },
      {
        path: '/annotator/:imageId',
        element: (
          <Authenticated>
            <Annotator />
          </Authenticated>
        ),
      },
      {
        path: '/models',
        element: (
          <Authenticated>
            <Models />
          </Authenticated>
        ),
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/_playground',
        element: <Playground />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals;
