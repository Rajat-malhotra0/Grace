import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Components/Header';
import Content from './Content';
import Footer from './Components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Content />
      <Footer />
    </Router>
  );
}

export default App;
