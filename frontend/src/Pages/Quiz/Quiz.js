import React, { useState } from "react";
import "./Quiz.css";

function Quiz() {
    const questions = [
        {
            questionText: "What cause are you most passionate about?",
            answerOptions: [
                { answerText: "Environmental Protection" },
                { answerText: "Education" },
                { answerText: "Healthcare" },
                { answerText: "Animal Welfare" },
            ],
        },
        {
            questionText: "How do you prefer to contribute?",
            answerOptions: [
                { answerText: "Volunteering my time" },
                { answerText: "Donating money" },
                { answerText: "Donating goods" },
                { answerText: "Spreading awareness" },
            ],
        },
        {
            questionText: "What kind of impact do you want to make?",
            answerOptions: [
                { answerText: "Local community impact" },
                { answerText: "Global impact" },
                { answerText: "Emergency relief" },
                { answerText: "Long-term development" },
            ],
        },
        {
            questionText: "Which skill would you like to use?",
            answerOptions: [
                { answerText: "Teaching or mentoring" },
                { answerText: "Event organization" },
                { answerText: "Manual labor (e.g., building, cleaning)" },
                { answerText: "Technical skills (e.g., web development)" },
            ],
        },
    ];

    const [showStart, setShowStart] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    const handleStartQuiz = () => {
        setShowStart(false);
        setShowQuiz(true);
    };

    const handleAnswerOptionClick = (answer) => {
        setAnswers([...answers, answer]);

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowQuiz(false);
            setShowResults(true);
        }
    };

    const handleRestartQuiz = () => {
        setShowResults(false);
        setShowStart(true);
        setCurrentQuestion(0);
        setAnswers([]);
    };

    return (
        <div className="quiz-page">
            <div className="quiz-card">
                {showStart && (
                    <div className="start-screen">
                        <h1>Ready for the Challenge?</h1>
                        <p>
                            This quick quiz will help us match you with the
                            perfect opportunity to make a difference.
                        </p>
                        <button onClick={handleStartQuiz}>Start Quiz</button>
                    </div>
                )}

                {showResults && (
                    <div className="results-screen">
                        <h1>Thank You!</h1>
                        <p>
                            Based on your answers, we'll recommend the best NGOs
                            and tasks for you.
                        </p>
                        <button onClick={handleRestartQuiz}>
                            Restart Quiz
                        </button>
                    </div>
                )}

                {showQuiz && (
                    <div className="quiz-screen">
                        <div className="question-section">
                            <div className="question-count">
                                <span>Question {currentQuestion + 1}</span>/
                                {questions.length}
                            </div>
                            <div className="question-text">
                                {questions[currentQuestion].questionText}
                            </div>
                        </div>
                        <div className="answer-section">
                            {questions[currentQuestion].answerOptions.map(
                                (answerOption, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleAnswerOptionClick(
                                                answerOption.answerText
                                            )
                                        }
                                    >
                                        {answerOption.answerText}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Quiz;
