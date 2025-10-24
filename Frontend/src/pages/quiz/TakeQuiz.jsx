import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeUp, setTimeUp] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // TODO: Fetch quiz data from API
    // Temporary mock data
    setQuiz({
      id: '1',
      title: 'Physics Mechanics',
      description: 'Test your knowledge of Newton\'s laws and kinematics',
      duration: 60,
      questions: [
        {
          id: '1',
          text: 'What is Newton\'s first law of motion?',
          options: [
            'An object in motion stays in motion',
            'Force equals mass times acceleration',
            'Every action has an equal and opposite reaction',
            'None of the above'
          ],
          correctAnswer: 0,
          marks: 4
        }
      ],
      createdBy: 'admin1',
      createdAt: new Date(),
    });
  }, [id]);

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedOption };
        return updated;
      }
      return [...prev, { questionId, selectedOption }];
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0
    let totalMarks = 0
    let earnedMarks = 0

    quiz.questions.forEach((question, index) => {
      const marks = question.marks || 1
      totalMarks += marks
      
      const userAnswer = answers.find(a => a.questionId === question.id)?.selectedOption
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
        earnedMarks += marks
      }
    })

    const percentage = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0
    
    return {
      score: correctAnswers,
      totalQuestions: quiz.questions.length,
      earnedMarks,
      totalMarks,
      percentage: Math.round(percentage * 10) / 10
    }
  }

  const handleSubmit = () => {
    const endTime = Date.now()
    const timeTaken = Math.floor((endTime - startTime) / 1000)
    const totalTime = quiz.duration * 60
    
    const scoreData = calculateScore()
    
    // Convert answers format to match CurrentQuiz format
    const formattedAnswers = {}
    answers.forEach((answer, index) => {
      const questionIndex = quiz.questions.findIndex(q => q.id === answer.questionId)
      if (questionIndex !== -1) {
        formattedAnswers[questionIndex] = answer.selectedOption
      }
    })
    
    console.log('Submitting answers:', answers);
    console.log('Score data:', scoreData);
    
    // Navigate to results page with score data
    navigate("/quiz-results", {
      state: {
        quizData: quiz,
        userAnswers: formattedAnswers,
        score: scoreData.score,
        totalQuestions: scoreData.totalQuestions,
        earnedMarks: scoreData.earnedMarks,
        totalMarks: scoreData.totalMarks,
        percentage: scoreData.percentage,
        timeTaken,
        totalTime
      }
    })
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    handleSubmit();
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className='m-10'>
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="text-lg font-medium">
            <Countdown
              date={Date.now() + quiz.duration * 60 * 1000}
              onComplete={handleTimeUp}
              renderer={({ minutes, seconds }) => (
                <span className="font-mono">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              )}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </h2>
            <span className="text-sm text-gray-500">
              {question.marks} marks
            </span>
          </div>

          <p className="text-lg mb-4">{question.text}</p>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={answers.find(a => a.questionId === question.id)?.selectedOption === index}
                  onChange={() => handleAnswer(question.id, index)}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-indigo-600 disabled:text-gray-400"
          >
            Previous
          </button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
              className="px-4 py-2 text-indigo-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default TakeQuiz;
