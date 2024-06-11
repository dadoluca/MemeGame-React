import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import  LoginPage  from './pages/LoginPage';
import NotFound from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import { useContext } from 'react';
import { AuthContext } from './state/AuthContext';
import RootLayout from './pages/RootLayout';
import ErrorComponent from './components/ErrorTestComponent';

function App() {
  const { loggedIn } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      element: <RootLayout/>,
      errorElement: <ErrorPage/>,//Loading errors of a valid route
      children: [
        {
          path: "/",
          element: <div><h1>Home</h1></div>

        },
        {
          path: "/login",
          element: loggedIn ? <Navigate to="/" /> : <LoginPage  />,
        },
        {
          path: "*",
          element: <NotFound/> //Undefined URLs 
        },
        {
          path: "/error", // Test path to generate an error for testing errors display
          element: <ErrorComponent />
        },
      ],
    },
  
  ]);

  return <RouterProvider router={router} />;
}

export default App
