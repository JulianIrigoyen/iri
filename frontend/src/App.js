import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Main from './components/Main';
import Footer from './components/Footer';
import Blog from './components/Blog';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <NavBar />
        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/" element={<Main />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
