import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Container, Row, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginForm, LogoutButton } from './components/AuthComponents';
import NavHeader from "./components/NavHeader";
import NotFound from './pages/NotFoundPage';
import API from './API.mjs';
import ErrorPage from './pages/ErrorPage';



function App() {
  const [loggedIn, setLoggedIn] = useState(false); 
  const [message, setMessage] = useState(''); 
  const [user, setUser] = useState(''); 

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth().catch(err => {if(err.error == "Not authenticated") console.log("User not logged in")});
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials)
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);
      // clean up everything
      setMessage({msg: `Logged out`, type: 'success'});
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };


  // Inline component throwing an error to test the error display
  const ErrorComponent = () => {
    throw new Error('Questo è un errore di test!');
  };

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavHeader loggedIn={loggedIn} logoutFunction={handleLogout} />
          <Container fluid className='mt-3'>
            {message && <Row>
              <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
            </Row> }
            <Outlet/>
          </Container>  
        </>
      ),
      errorElement: <ErrorPage/>,//Loading errors of a valid route
      children: [
        {
          path: "/",
          element: <div><h1>Home</h1></div>

        },
        {
          path: "/login",
          element: loggedIn ? <Navigate to="/" /> : <LoginForm loginFunction={handleLogin} />,
        },
        {
          path: "*",
          element: <NotFound/> //Undefined URLs 
        },
        {
          path: "/error", // Test path to generate an error
          element: <ErrorComponent />
        },
      ],
    },
  
  ]);

  return <RouterProvider router={router} />;
}

export default App
