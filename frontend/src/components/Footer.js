import styled from 'styled-components';
import { FaInstagram, FaSoundcloud, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const Footer = styled.footer`
  background-color: #282c34;
  height: 12vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 0 2rem;
  box-sizing: border-box;

  a {
    color: white;
    margin: 0 1rem;
    text-decoration: none;
  }
`;

export default function() {
  return (
    <Footer>
      <p>&copy; {new Date().getFullYear()} iRi 0.1 </p>
      <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><FaInstagram /></a>
      <a href="https://www.soundcloud.com/" target="_blank" rel="noreferrer"><FaSoundcloud /></a>
      <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
      <a href="https://wa.me/5491136639160" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
    </Footer>
  );
}
