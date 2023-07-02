import React, {useState} from 'react';
import styled from 'styled-components';

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
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  }

const askGPT3 = () => {
        fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({question})
        })
        .then(response => {
            console.log('got response')
            return response.json()
        })
        .then(data => {
            console.log(data)
            setResponse(data.response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

  return (
    <Main>
      <p>
        This is the main content section.
      </p>
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Ask a question"
      />
      <button onClick={askGPT3}>Ask GPT-3</button>
      {response && <p>{response}</p>}
    </Main>
  );
}
