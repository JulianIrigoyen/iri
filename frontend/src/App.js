import React from 'react';
import './App.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <NavBar />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
