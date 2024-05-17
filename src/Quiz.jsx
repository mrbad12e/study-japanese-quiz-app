// src/Quiz.jsx
import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = ({ language }) => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showPronounce, setShowPronounce] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/data_${language}.json`);
            const data = await response.json();
            setWords(data);
            if (currentWordIndex !== null) {
                // Generate options using the current index without shuffling
                const correctWord = data[currentWordIndex];
                const start = Math.max(0, currentWordIndex - 3);
                const end = Math.min(data.length, currentWordIndex + 4);
                const nearestWords = data.slice(start, end).filter(word => word.word !== correctWord.word);
                let newOptions = [correctWord, ...nearestWords.slice(0, 3)];
                setOptions(newOptions);
            } else {
                const initialIndex = getRandomIndex(data.length);
                setCurrentWordIndex(initialIndex);
                generateOptions(data, initialIndex);
            }
        };

        fetchData();
    }, [language]);

    const getRandomIndex = (length) => {
        return Math.floor(Math.random() * length);
    };

    const generateOptions = (words, index) => {
        const correctWord = words[index];
        const start = Math.max(0, index - 3);
        const end = Math.min(words.length, index + 4);
        const nearestWords = words.slice(start, end).filter(word => word.word !== correctWord.word);
        let options = [correctWord, ...nearestWords.slice(0, 3)];
        options = options.sort(() => Math.random() - 0.5); // Shuffle options once

        setOptions(options);
        setShowPronounce(false);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setShowPronounce(true);
        if (option.word === words[currentWordIndex].word) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNext = () => {
        const nextIndex = getRandomIndex(words.length);
        setCurrentWordIndex(nextIndex);
        generateOptions(words, nextIndex);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    if (words.length === 0) return <div>Loading...</div>;

    const currentWord = words[currentWordIndex];

    return (
        <div className="quiz">
            <h2>What is the meaning of: {currentWord.word}</h2>
            <div className="options">
                {options.map(option => (
                    <button
                        key={option.word}
                        className={`option ${selectedOption ?
                            (option.word === currentWord.word ? 'correct' :
                                (option.word === selectedOption.word ? 'incorrect' : '')) : ''}`}
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
    );
};

export default Quiz;
