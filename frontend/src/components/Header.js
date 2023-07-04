import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';

const HeaderContent = styled.header`
  background-color: #2A2E3D;
  height: 6vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
  color: #FFFFFF;
  position: relative;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 1.2em;
  color: #FECF6A; 
  text-transform: uppercase;
  align-items: flex-start;
`;

const Hamburger = styled(FiMenu)`
  font-size: 2em;
  color: #FECF6A;
  cursor: pointer;
  align-items: flex-end;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(42,46,61,0.9); // Adjusted the color to match the Header's color
  z-index: 10;
  display: ${props => props.show ? 'block' : 'none'};
  transition: opacity 0.3s ease-in-out; // Add transition to make it smoother
`;

const Navigation = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #30D5C8;
  transform: ${props => props.show ? 'translateX(0)' : 'translateX(-100%)'}; // Change the direction to left
  transition: transform 0.5s ease-in-out; // Increase the duration for a smoother transition
  z-index: 11;
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const NavItem = styled.div`
  padding: 0.5em 0;
  border-bottom: 1px solid #2A2E3D;
  color: #2A2E3D;
  cursor: pointer;
`;

const Header = () => {
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <HeaderContent>
        <Hamburger onClick={() => setShowNav(!showNav)} />
        <Title>iRi 0.1</Title>
      </HeaderContent>
      <Overlay show={showNav} onClick={() => setShowNav(false)} />
      <Navigation show={showNav}>
        <NavItem>Home</NavItem>
        <NavItem>About</NavItem>
        <NavItem>Services</NavItem>
        <NavItem>Contact</NavItem>
      </Navigation>
    </>
  );
}

export default Header;