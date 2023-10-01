import React, { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Quiz = () => {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    // Fetch questions from the server
    fetch('http://localhost:3000/api/questions') 
      .then(response => response.json())
      .then(data => {
        // Shuffle the questions
        const shuffledQuestions = shuffleArray(data)
        // Set the questions in the component state
        setQuestions(shuffledQuestions.slice(0, 10)) 
        setShowQuiz(true)
      })
      .catch(error => {
        console.error('Error fetching questions:', error)
      })
  }, [])

  const shuffleArray = array => {
    // Function to shuffle an array
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleAnswerChange = event => {
    const selectedOption = event.target.value
    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex] = selectedOption
    setAnswers(updatedAnswers)
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1)
  }

  const handleSubmit = () => {
    setShowQuiz(false)
    setShowResult(true)
  }

  const handleTryAgain = () => {
    // Fetch and shuffle questions again for a new quiz
    fetch('http://localhost:3000/api/questions') 
      .then(response => response.json())
      .then(data => {
        const shuffledQuestions = shuffleArray(data)
        setQuestions(shuffledQuestions.slice(0, 10))
        setCurrentQuestionIndex(0)
        setAnswers([])
        setShowQuiz(true)
        setShowResult(false)
      })
      .catch(error => {
        console.error('Error fetching questions:', error)
      })
  }
  const renderQuiz = () => (
    <div className='quiz-container'>
      <div className='quiz-header text-center'>
        <h1>Quiz Created in MERN Stack</h1>
      </div>
      <div className='quiz-body no-select'>
        <h4>
          {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
        </h4>
        <ul className='list-group'>
          {questions[currentQuestionIndex].options.map(
            (option, optionIndex) => (
              <li key={optionIndex} className='list-group-item'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name={`question${currentQuestionIndex}`}
                    value={option}
                    checked={answers[currentQuestionIndex] === option}
                    onChange={handleAnswerChange}
                    id={`question${currentQuestionIndex}-option${optionIndex}`}
                  />
                  <label
                    className='form-check-label'
                    htmlFor={`question${currentQuestionIndex}-option${optionIndex}`}
                  >
                    {option}
                  </label>
                </div>
              </li>
            )
          )}
        </ul>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            className='btn btn-primary nxt-btn '
            onClick={handleNextQuestion}
          >
            Next
          </button>
        ) : (
          <button className='btn btn-primary' onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  )

  const renderResult = () => {
    const score = answers.reduce((totalScore, answer, index) => {
      if (answer === questions[index].answer) {
        return totalScore + 1
      }
      return totalScore
    }, 0)

    return (
      <div className='quiz-container'>
        <div className='quiz-body'>
          <h2>Result</h2>
          <p>
            Your Score: {score} out of {questions.length}
          </p>
          <button className='btn btn-primary' onClick={handleTryAgain}>
            Try Again
          </button>
        </div>
        {score < 5 ? (
          <div className='gif-container'>
            <p>You Failed.</p>
            <img
              src={require('./laugh.gif')}
              alt='Hahahahaha'
              className='gif'
            />
          </div>
        ) : score >= 5 ? (
          <div className='gif-container'>
            <p>You Passed.</p>
            <img src={require('./Nice.gif')} alt='Good Work' className='gif' />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div>{showQuiz ? renderQuiz() : showResult ? renderResult() : null}</div>
  )
}

export default Quiz
