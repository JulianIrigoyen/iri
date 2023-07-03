import React, { useState } from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  transition: transform var(--transition-speed);

  &:hover {
    transform: translateY(-10px);
  }
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;

  &:hover {
    transform: scale(1.1);
  }
`;


const Heading = styled.h2`
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const Body = styled.p`
  text-align: justify;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  background-color: var(--color-btn);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border-radius: 5px;
  transition: background-color var(--transition-speed);

  &:hover {
    background-color: darken(var(--color-btn), 10%);
  }
`;

const symbols = ["BTC","ETH","ADA"]; //"MATIC","BNB","XRP","SOL","DOT","UNI","AVAX","LINK","XMR"

const GPTWidget = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [analysis, setAnalysis] = useState(null);
  const [fundamentals, setFundamentals] = useState(null);

    const getFundamentals = () => {
    fetch('/api/fundamentals')  // adjust the URL according to your backend
      .then(response => response.json())
      .then(data => setFundamentals(data))
      .catch((error) => console.error('Error:', error));
  };


  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  }

  const handleSymbolChange = (e) => {
    setSelectedSymbol(e.target.value);
  }

   const handleDetailedReport = () => {
    fetch('/detailed-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ symbols })
    })
    .then(response => response.json())
    .then(data => console.log(data))  // Here you should handle the response appropriately.
    .catch((error) => console.error('Error:', error));
  };

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

  const analyzeSymbol = () => {
    fetch(`/analyze/${selectedSymbol}`)
    .then(response => response.json())
    .then(data => setAnalysis(data.analysis))
    .catch((error) => console.error('Error:', error));
  };

   return (
    <WidgetContainer>
      <div>
        <TabButton onClick={() => setActiveTab("chat")}>Chat GPT-3</TabButton>
        <TabButton onClick={() => setActiveTab("fin")}>Fin Talk</TabButton>
        <TabButton onClick={() => {setActiveTab("fun"); getFundamentals();}}>Fun Talk</TabButton>
      </div>
      {/* Removed extra </div> tag here. */}

      {activeTab === "chat" &&
        <>
          <Heading>Ask GPT-3</Heading>
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask a question"
          />
          <ActionButton onClick={askGPT3}>Ask GPT-3</ActionButton>
          {response && <Body>{response}</Body>}
        </>
      }

      {activeTab === "fin" &&
        <>
          <Heading>Fin Talk</Heading>
          <select value={selectedSymbol} onChange={handleSymbolChange}>
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
          <ActionButton onClick={analyzeSymbol}>Analyze</ActionButton>
          <ActionButton onClick={handleDetailedReport}>Detailed report</ActionButton>
          {analysis && <Body>{analysis}</Body>}
        </>
      }
      {activeTab === "fun" &&
        <>
          <Heading>Fun Talk</Heading>
          {fundamentals &&
            Object.keys(fundamentals).map(key => (
              <div key={key}>
                <h3>{key}</h3>
                <Body>{JSON.stringify(fundamentals[key])}</Body>
              </div>
            ))
          }
        </>
      }
    </WidgetContainer>
  );
};

export default GPTWidget;
