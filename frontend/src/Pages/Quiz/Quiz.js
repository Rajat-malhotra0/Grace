import React, { useState } from "react";
import questionsFile from "../../data/quiz_questions.json";
import "./Quiz.css";

function Quiz() {
    const [questions] = useState(questionsFile);
    const [showStart, setShowStart] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState("q1_cause_area");
    const [answers, setAnswers] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const maxQuestions = 10;

    const findQuestionById = (id) => {
        return questions.find((q) => q.id === id);
    };

    const handleStartQuiz = () => {
        setShowStart(false);
        setShowQuiz(true);
    };

    const handleAnswerOptionClick = (answerOption) => {
        const newAnswers = [
            ...answers,
            {
                questionId: currentQuestionId,
                answer: answerOption.answerText,
            },
        ];
        setAnswers(newAnswers);

        const newQuestionCount = questionCount + 1;
        setQuestionCount(newQuestionCount);

        if (!answerOption.nextQuestionId || newQuestionCount >= maxQuestions) {
            setShowQuiz(false);
            setShowResults(true);
            console.log(newAnswers);
        } else {
            setCurrentQuestionId(answerOption.nextQuestionId);
        }
    };

    const handleRestartQuiz = () => {
        setShowResults(false);
        setShowStart(true);
        setCurrentQuestionId("q1_cause_area");
        setAnswers([]);
        setQuestionCount(0);
    };

    const currentQuestion = findQuestionById(currentQuestionId);

    return (
        <div className="quiz-page">
            <div className="quiz-card">
                {showStart ? (
                    <div className="start-screen">
                        <h1>Ready for the Challenge?</h1>
                        <p>
                            This quick quiz will help us match you with the
                            perfect opportunity to make a difference.
                        </p>
                        <button onClick={handleStartQuiz}>Start Quiz</button>
                    </div>
                ) : showResults ? (
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
                ) : showQuiz && currentQuestion ? (
                    <div className="quiz-screen">
                        <div className="question-section">
                            <div className="question-count">
                                <span>Question {questionCount + 1}</span>/
                                {maxQuestions}
                            </div>
                            <div className="question-text">
                                {currentQuestion.questionText}
                            </div>
                        </div>
                        <div className="answer-section">
                            {currentQuestion.answerOptions.map(
                                (answerOption, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleAnswerOptionClick(
                                                answerOption
                                            )
                                        }
                                    >
                                        {answerOption.answerText}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Quiz;
