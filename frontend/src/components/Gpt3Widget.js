import React, {useState} from 'react';
import styled from 'styled-components';

const PreContainer = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const TabContainer = styled.div`
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 1rem;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  align-items: flex-start;

  h2 {
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: left;
  }

  input, select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #2d1d1d;
    }
  }
`;

const AnalysisText = styled.p`
  text-align: justify;
  font-size: 16px;
  line-height: 1.5;
  margin-top: 1em;
`;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  transition: transform var(--transition-speed);

  &:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    width: 100%;
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
const symbols = ["BTC", "ETH", "ADA", "MATIC","BNB","XRP","SOL","DOT","UNI","AVAX","LINK","XMR"]; //"MATIC","BNB","XRP","SOL","DOT","UNI","AVAX","LINK","XMR"

const GPTWidget = () => {
    const [activeTab, setActiveTab] = useState("chat");
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState(null);
    const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
    const [analysis, setAnalysis] = useState(null);
    const [fundamentals, setFundamentals] = useState(null);
    const [onchainData, setOnchainData] = useState(null);

    //web3 tab data
    const [contractAddress, setContractAddress] = useState(""); // Placeholder, replace with actual Ethereum address
    const [abi, setAbi] = useState(""); // Placeholder, replace with actual contract ABI
    const [blockNumber, setBlockNumber] = useState('latest');

    const getFundamentals = () => {
        fetch('/fundamentals')  // adjust the URL according to your backend
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

    const fetchOnchainData = () => {
        fetch('/onchain-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({contract_address: contractAddress, abi: abi, block_number: blockNumber})
        })
            .then(response => response.json())
            .then(data => setOnchainData(data))
            .catch((error) => console.error('Error:', error));
    }


    const handleDetailedReport = () => {
        fetch('/detailed-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({symbols})
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
            body: JSON.stringify({question})
        })
            .then(response => response.json())
            .then(data => setResponse(data.response))
            .catch((error) => console.error('Error:', error));
    };

    const analyzeSymbol = () => {
    fetch(`/analyze/${selectedSymbol}`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            console.log(data); // check what's actually in your data
            setAnalysis(data.adapted_analysis);
        })
        .catch((error) => {
            console.error('Error:', error);
            setAnalysis(null);
        });
};


    return (
        <WidgetContainer>
            <div>
                <TabButton onClick={() => setActiveTab("chat")}>Chat GPT-3</TabButton>
                <TabButton onClick={() => setActiveTab("fin")}>Fin Talk</TabButton>
                <TabButton onClick={() => setActiveTab("fun")}>Fun Talk</TabButton>
                <TabButton onClick={() => setActiveTab("web3")}>Web3 Talk</TabButton>
            </div>
            {activeTab === "chat" && (
                <TabContainer>
                    <h2>Ask GPT-3</h2>
                    <input
                        type="text"
                        value={question}
                        onChange={handleQuestionChange}
                        placeholder="Ask a question"
                    />
                    <button onClick={askGPT3}>Ask GPT-3</button>
                    {response && <pre>{response}</pre>}
                </TabContainer>
            )}
            {activeTab === "fin" && (
                <TabContainer>
                    <h2>Fin Talk</h2>
                    <select value={selectedSymbol} onChange={handleSymbolChange}>
                        {symbols.map(symbol => (
                            <option key={symbol} value={symbol}>{symbol}</option>
                        ))}
                    </select>
                    <button onClick={analyzeSymbol}>Analyze</button>
                    {analysis && <AnalysisText>{analysis}</AnalysisText>}
                </TabContainer>
            )}
            {activeTab === "fun" && (
                <TabContainer>
                    <h2>Fun Talk</h2>
                    {/* Implement Fun Talk functionality */}
                </TabContainer>
            )}
            {activeTab === "web3" && (
                <TabContainer>
                    <h2>Web3 Talk</h2>
                    <input
                        type="text"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        placeholder="Contract address"
                    />
                    <input
                        type="text"
                        value={abi}
                        onChange={(e) => setAbi(e.target.value)}
                        placeholder="Contract ABI"
                    />
                    <input
                        type="text"
                        value={blockNumber}
                        onChange={(e) => setBlockNumber(e.target.value)}
                        placeholder="Block number"
                    />
                    <button onClick={fetchOnchainData}>Fetch Onchain Data</button>
                    {onchainData && <PreContainer>
                        <pre>{JSON.stringify(onchainData, null, 2)}</pre>
                    </PreContainer>}
                </TabContainer>
            )}
        </WidgetContainer>
    );
};

export default GPTWidget;