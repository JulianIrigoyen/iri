import styled from 'styled-components';

const NavBar = styled.nav`
  background-color: #282c34;
  height: 8vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
`;

export default function() {
  return (
    <NavBar>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </NavBar>
  );
}
