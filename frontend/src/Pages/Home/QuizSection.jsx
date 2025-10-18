import React, { useRef, useEffect } from 'react';
import Button from "../../Components/Button";
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './QuizSection.css';
import fireplaceVideo from "../../assets/fireplace.mp4";

function QuizSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <section className="quiz-section">
      <video
        ref={videoRef}
        className="quiz-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={fireplaceVideo} type="video/mp4" />
      </video>

      <div className="quiz-overlay" />

      <div className="quiz-content">
        <div className="quiz-text-container">
          <h2 className="quiz-heading">
            THIS <em className="quiz-italic">fire</em> IS YOURS.<br />
            <em className="quiz-italic">Not sure where to begin?</em> <br />
            <em className="quiz-italic">Take this quiz, and let us guide you</em><br />
             WHERE YOUR GRACE BELONGS.

          </h2>

          <Link to="/quiz">
            <Button
              text={
                <>
                  TAKE THE QUIZ
                  <ChevronRight className="quiz-icon" />
                </>
              }
              className="quiz-button"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default QuizSection;