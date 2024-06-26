import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoutButton from '../common/LogoutButton';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FaUser } from 'react-icons/fa';

function NavHeader() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <Navbar bg='primary' data-bs-theme='dark' style={{ maxHeight: '12vh' }}>
      <Container fluid>
        <Link to='/' className='navbar-brand'>Memes Game</Link>
        <div>
          {loggedIn && 
            <Link to='/profile' className='btn btn-outline-light me-2'>
              <FaUser />
            </Link>
          }
          {loggedIn ? 
            <LogoutButton/> :
            <Link to='/login' className='btn btn-outline-light'>Login</Link>
          }
        </div>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
