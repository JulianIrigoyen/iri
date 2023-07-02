import React, { useState } from 'react';
import styled from 'styled-components';
import Gpt3Widget from "./Gpt3Widget";

const Main = styled.main`
  background-color: #ffffff;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: #282c34;
`;

export default function MainComponent() {
  return (
    <Main>
      <p>
        Start getting insight now
      </p>
      <Gpt3Widget />
    </Main>
  );
}
