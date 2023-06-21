import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import NavBar from './NavBar'
import SignIn from './auth/signIn'
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const routers = createBrowserRouter([
    {
        path: '/',
        element: (<App />)
    },
    {
        path: '/auth/signin',
        element: (<SignIn />)
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <div className='mb-16'>
            <NavBar />
        </div>
        <div className='mt-8'>
            <RouterProvider router={routers} />
        </div>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
