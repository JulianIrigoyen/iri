import React, { useState } from 'react';
import styled from 'styled-components';
import GPTWidget from "./Gpt3Widget";
import Sidebar from "./Sidebar";

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
        <Sidebar />
      <GPTWidget />
    </Main>
  );
}
