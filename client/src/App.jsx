import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Container, Row, Alert } from 'react-bootstrap';
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginForm } from './components/AuthComponents';
import NavHeader from "./components/NavHeader";
import NotFound from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import { useContext } from 'react';
import { AuthContext } from './state/AuthContext';

function App() {
  const { loggedIn, message, setMessage} = useContext(AuthContext);

  // Inline component throwing an error to test the error display
  const ErrorComponent = () => {
    throw new Error('Questo è un errore di test!');
  };

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavHeader/>
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
          element: loggedIn ? <Navigate to="/" /> : <LoginForm />,
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
