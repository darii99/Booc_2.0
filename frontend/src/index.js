import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import ErrorPage from './component/ErrorPage.js'
import LoginRoot from './component/login/Login_root.js';
import Login from "./component/login/Login.js"
import SignUp from "./component/login/Sign_up.js"
import Profile from "./component/profile/Profile.js"
import Feed from "./component/feed/Feed.js"
import Test from './component/forms/create_new_event.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRoot />,
    errorElement: <ErrorPage />,
    children:[
      {
        index: true,
        //path:"Login",
        element: <Login />,
      },
      {
        path:"SignUp",
        element: <SignUp />,
      }
    ],
  },
  {
    path: "/Profile",
    element: <Profile />
  },
  {
    path: "/Feed",
    element: <Feed />
  }
]);

//testa den här i
const testrouter = createBrowserRouter([
  {
    path: "/",
    element: <Test />,
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
