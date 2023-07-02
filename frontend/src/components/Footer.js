import styled from 'styled-components';

const Footer = styled.footer`
  background-color: #282c34;
  min-height: 12vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

export default function() {
  return (
    <Footer>
      <p>&copy; {new Date().getFullYear()} My Website</p>
    </Footer>
  );
}
