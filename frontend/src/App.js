import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Components/Header';
import Content from './Content';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Components/Header';
import Content from './Content';

function App() {
    return (
        <Router>
            <Header />
            <Content />
        </Router>
    );
}

export default App;
