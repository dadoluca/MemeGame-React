import { Button } from 'react-bootstrap';   
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
function LogoutButton() {
      const { handleLogout } = useContext(AuthContext);
      return(
        <Button variant='outline-light' onClick={handleLogout}>Logout</Button>
      );
    }
    
export default LogoutButton;