import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import questionsFile from "../../data/quiz_questions.json";
import NGORecommendations from "../../Components/NgoRecommendations";

import "./Quiz.css";

function Quiz() {
    const { user, token } = useContext(AuthContext);
    const [questions] = useState(questionsFile);
    const [showStart, setShowStart] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState("q1_cause_area");
    const [answers, setAnswers] = useState([]);
    const [aggregatedData, setAggregatedData] = useState({
        skills: [],
        interests: [],
        availabilityHours: 0,
        commitmentLevel: "",
        volunteerType: "",
        travelWillingness: "",
        motivation: [],
        workStyle: [],
        intent: "",
    });
    const [questionCount, setQuestionCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const maxQuestions = 10;

    const findQuestionById = (id) => {
        return questions.find((q) => q.id === id);
    };

    const aggregateInferredInformation = (inferredInfo) => {
        setAggregatedData((prevData) => {
            const newData = { ...prevData };

            //just for everyone's reference => Set just takes some values and merge them into an array, if there are duplicates, only one is selected
            if (inferredInfo.skills) {
                newData.skills = [
                    ...new Set([...newData.skills, ...inferredInfo.skills]),
                ];
            }

            if (inferredInfo.interests) {
                newData.interests = [
                    ...new Set([
                        ...newData.interests,
                        ...inferredInfo.interests,
                    ]),
                ];
            }

            if (inferredInfo.availabilityHours) {
                newData.availabilityHours = inferredInfo.availabilityHours;
            }

            if (inferredInfo.commitmentLevel) {
                newData.commitmentLevel = inferredInfo.commitmentLevel;
            }

            if (inferredInfo.volunteerType) {
                newData.volunteerType = inferredInfo.volunteerType;
            }

            if (inferredInfo.travelWillingness) {
                newData.travelWillingness = inferredInfo.travelWillingness;
            }

            if (inferredInfo.motivation) {
                newData.motivation = [
                    ...new Set([
                        ...newData.motivation,
                        ...inferredInfo.motivation,
                    ]),
                ];
            }

            if (inferredInfo.workStyle) {
                newData.workStyle = [
                    ...new Set([
                        ...newData.workStyle,
                        ...inferredInfo.workStyle,
                    ]),
                ];
            }

            if (inferredInfo.intent) {
                newData.intent = inferredInfo.intent;
            }

            return newData;
        });
    };

    const handleStartQuiz = () => {
        setShowStart(false);
        setShowQuiz(true);
    };

    const handleAnswerOptionClick = (answerOption) => {
        setAnswers((prevAnswers) => [
            ...prevAnswers,
            {
                questionId: currentQuestionId,
                answer: answerOption.answerText,
                inferredInformation: answerOption.inferredInformation || {},
            },
        ]);

        if (answerOption.inferredInformation) {
            aggregateInferredInformation(answerOption.inferredInformation);
        }

        const newQuestionCount = questionCount + 1;
        setQuestionCount(newQuestionCount);

        if (!answerOption.nextQuestionId || newQuestionCount >= maxQuestions) {
            setShowQuiz(false);
            setShowResults(true);
        } else {
            setCurrentQuestionId(answerOption.nextQuestionId);
        }
    };

    const submitQuizResults = async () => {
        if (!user) {
            alert("Please log in to save your quiz results.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                "http://localhost:3001/api/quiz/submit",
                {
                    answers: answers,
                    aggregatedData: aggregatedData,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            if (response.status === 200) {
                setShowResults(false);
                setShowRecommendations(true);
            } else {
                throw new Error("Failed to submit quiz results");
            }
        } catch (error) {
            alert("Failed to submit quiz results. Please try again.");
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestartQuiz = () => {
        setShowResults(false);
        setShowRecommendations(false);
        setShowStart(true);
        setCurrentQuestionId("q1_cause_area");
        setAnswers([]);
        setQuestionCount(0);
        setAggregatedData({
            skills: [],
            interests: [],
            availabilityHours: 0,
            commitmentLevel: "",
            volunteerType: "",
            travelWillingness: "",
            motivation: [],
            workStyle: [],
            intent: "",
        });
    };

    const currentQuestion = findQuestionById(currentQuestionId);

    if (showRecommendations) {
        return <NGORecommendations onRestart={handleRestartQuiz} />;
    }

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
                            and opportunities for you.
                        </p>
                        <div className="aggregated-data-preview">
                            <h3>Your Profile Summary:</h3>
                            <p>
                                <strong>Skills:</strong>{" "}
                                {aggregatedData.skills.slice(0, 5).join(", ")}
                                {aggregatedData.skills.length > 5 ? "..." : ""}
                            </p>
                            <p>
                                <strong>Interests:</strong>{" "}
                                {aggregatedData.interests
                                    .slice(0, 3)
                                    .join(", ")}
                                {aggregatedData.interests.length > 3
                                    ? "..."
                                    : ""}
                            </p>
                            <p>
                                <strong>Availability:</strong>{" "}
                                {aggregatedData.availabilityHours} hours/week
                            </p>
                            <p>
                                <strong>Commitment:</strong>{" "}
                                {aggregatedData.commitmentLevel}
                            </p>
                        </div>
                        <div className="results-actions">
                            <button
                                onClick={submitQuizResults}
                                disabled={isSubmitting}
                                className="primary-button"
                            >
                                {isSubmitting
                                    ? "Finding Matches..."
                                    : "Get My NGO Recommendations"}
                            </button>
                            <button
                                onClick={handleRestartQuiz}
                                className="secondary-button"
                            >
                                Restart Quiz
                            </button>
                        </div>
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
