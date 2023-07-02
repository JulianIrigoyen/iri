import styled from 'styled-components';

const Header = styled.header`
  background-color: #282c34;
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

export default function() {
  return (
    <Header>
      <h1>Welcome to My Website</h1>
    </Header>
  );
}
