// src/App.jsx
import React, { useState } from 'react';
import Quiz from './Quiz';
import './App.css';

const App = () => {
  const [language, setLanguage] = useState('en'); // Default language is English

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'vi' : 'en'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='title'>JLPT Vocabulary Quiz</h1>
        <button onClick={toggleLanguage}>
          {language === 'en' ? 'Tiếng Việt' : 'English'}
        </button>
      </header>
      <Quiz language={language} />
    </div>
  );
};

export default App;
