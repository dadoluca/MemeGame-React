import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import  LogoutButton  from './LogoutButton';
import { useContext } from 'react';
import { AuthContext } from '../state/AuthContext';

// UPDATED
function NavHeader () {
  const { loggedIn } = useContext(AuthContext);

  return(
    <Navbar bg='primary' data-bs-theme='dark' style={{maxHeight: '12vh'}} >
      <Container fluid>
        <Link to='/' className='navbar-brand'>Memes Game</Link>
        {loggedIn ? 
          <LogoutButton/> :
          <Link to='/login'className='btn btn-outline-light'>Login</Link>
        }
      </Container>
    </Navbar>
  );
}

export default NavHeader;
