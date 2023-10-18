import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import Auth from 'routes/Auth/Auth';
import Datasets from 'routes/Datasets/Datasets';
import Dataset from 'routes/Dataset/Dataset';
import Annotator from 'routes/Annotator/Annotator';
import Models from 'routes/Models/Models';
import ErrorPage from './error';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import Authenticated from 'components/Authenticated';

/**
 * 서버 정보?, 로그인 정보
 * 사용할 페이지: 모든 페이지
 */

/** datasets
 * dataset 목록
 * 사용할 페이지: datasets
 */

/** dataset
 * datasetId, 이미지 목록
 * 사용할 페이지: dataset, annotator
 */

/** 이미지
 * imageId, 이미지 자체 정보(width, height, url..), category 목록
 * 사용할 페이지: annotator
 * /

/**
 * category
 * categoryId, 이름, annotation 목록
 * 사용할 페이지: annotator
 */

/** annotation
 * annotationId, polygon 정보
 * 사용할 페이지: annotator
 */

/**store에 저장할 정보
 * 서버정보와 로그인 정보는 모든 페이지에서 쓰니까 store에 저장
 */

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
            <Datasets />
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
