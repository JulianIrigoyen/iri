import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';

const Header = styled.header`
  background-color: #2A2E3D; // Change to a darker shade of blue
  height: 6vh; // Reduced size
  display: flex;
  align-items: center;
  justify-content: space-between; // Align items to the sides
  padding: 0 1em; // Add some padding
  color: #FFFFFF; // Change to white
  position: relative; // So the nav menu will appear under the header
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 1.2em;
  color: #FECF6A; // Fuchsia color
  text-transform: uppercase;
`;

const Hamburger = styled(FiMenu)`
  font-size: 2em;
  color: #6A057F; // Fuchsia color
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5); // Grey overlay
  z-index: 5;
  display: ${props => props.show ? 'block' : 'none'};
`;

const Navigation = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background-color: #30D5C8; // Turquoise color
  transform: ${props => props.show ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
  z-index: 10;
`;

export default function() {
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <Header>
        <Title>Iribot 0.1</Title>
        <Hamburger onClick={() => setShowNav(!showNav)} />
      </Header>
      <Overlay show={showNav} onClick={() => setShowNav(false)} />
      <Navigation show={showNav}>
        {/* Your navigation links go here */}
      </Navigation>
    </>
  );
}
