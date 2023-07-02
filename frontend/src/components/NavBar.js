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
  color: white;
  text-decoration: none;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #a9a9a9;
  }
`;

const Navbar = () => {
  return (
    <NavBar>
      <NavItem to="/about">About</NavItem>
      <NavItem to="/services">Services</NavItem>
      <NavItem to="/blog">Blog</NavItem>
      <NavItem to="/contact">Contact</NavItem>
    </NavBar>
  );
};

export default Navbar;
