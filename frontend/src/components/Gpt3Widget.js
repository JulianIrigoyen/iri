import React, { useState } from 'react';

const Gpt3Widget = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [btcAnalysis, setBtcAnalysis] = useState(null);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  }

  const askGPT3 = () => {
    fetch('/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => setResponse(data.response))
    .catch((error) => console.error('Error:', error));
  };

  const analyzeBtc = () => {
    fetch('/analyze-btc')
    .then(response => response.json())
    .then(data => setBtcAnalysis(data.message))
    .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Ask a question"
      />
      <button onClick={askGPT3}>Ask GPT-3</button>
      {response && <p>{response}</p>}
      <button onClick={analyzeBtc}>Analyze BTC</button>
      {btcAnalysis && <p>{btcAnalysis}</p>}
    </div>
  );
}

export default Gpt3Widget;
