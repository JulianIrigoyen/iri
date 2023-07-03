import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavBar = styled.nav`
  background-color: #282c34;
  height: 8vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;


const NavItem = styled(Link)`
  color: #FECF6A; // Fuchsia color
  text-decoration: none;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #6A057F; // Turquoise color
  }
`;

const Navbar = () => {
  return (
    <NavBar>
      <NavItem to="/">Home</NavItem>
      <NavItem to="/">Services</NavItem>
      <NavItem to="/blog">Blog</NavItem>
      <NavItem to="/">Contact</NavItem>
    </NavBar>
  );
};


export default Navbar;
