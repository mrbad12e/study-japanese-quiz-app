// src/Quiz.jsx
import React, { useState, useEffect } from 'react';
import './Quiz.css';
import viJson from './dummy_data/data_vi.json';
import enJson from './dummy_data/data_en.json';

const Quiz = () => {
    const [index, setIndex] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [showPronounce, setShowPronounce] = useState(false);
    const [language, setLanguage] = useState('');
    const [data, setData] = useState(enJson);

    const randomise = (index) => {
        let newIndex = index;
        if (index === null) {
            newIndex = getRandomIndex(data.length);
            setIndex(newIndex);
        }
        let currentWord = data.at(newIndex);
        let start = Math.max(0, newIndex - 3);
        let end = Math.min(data.length, newIndex + 4);
        let nearestWords = data.slice(start, end).filter((word, i) => i+start !== newIndex);
        let options = [currentWord, ...nearestWords.slice(0, 3)];
        options = options.sort(() => Math.random() - 0.5); // Shuffle options once

        setCorrectAnswers(currentWord);
        
        setOptions(options);
        setShowPronounce(false);
    }

    useEffect(() => {
        if (language === '') {
            setLanguage('en');
        }
        randomise(index);
    }, [index, language, data]);

    const getRandomIndex = (length) => {
        return Math.floor(Math.random() * length);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setShowPronounce(true);
        if (option.word === correctAnswers.word) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        setCorrectAnswers({});
        setOptions([]);
        randomise(null)
    };

    const toggleLanguage = () => {
        setLanguage((language) => (language === 'en' ? 'vi' : 'en'));
        setData(() => (language === 'en' ? viJson : enJson));
    };
    if (options.length === 0) return <div>Loading...</div>;

    return (
        <>
            <header className="App-header">
                <h1 className='title'>JLPT Vocabulary Quiz</h1>
                <button onClick={toggleLanguage}>
                    {language === 'en' ? 'English' : 'Tiếng Việt'}
                </button>
            </header>
            <div className="quiz">
                <h2>What is the meaning of: {correctAnswers.word}</h2>
                <div className="options">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`option ${selectedOption ?
                                (option.word === correctAnswers.word ? 'correct' :
                                    (option.word === selectedOption.word ? 'incorrect' : '')
                                ) : ''}`}
                            onClick={() => handleOptionClick(option)}
                            disabled={selectedOption !== null}
                        >
                            {option.meaning} {showPronounce && `(${option.pronounce})`}
                        </button>
                    ))}
                </div>
                {selectedOption && (
                    <button className="next-btn" onClick={handleNext}>
                        Next
                    </button>
                )}
            </div>
        </>
    );
};

export default Quiz;
