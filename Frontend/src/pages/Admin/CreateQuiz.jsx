import react from 'react';
import { useNavigate } from 'react-router-dom';
import QuizForm from "../../nonshadcncomponants/QuizForm.jsx";

export default function CreateQuiz(){
    const navigate = useNavigate();

    const handleSubmit = async (quizData) => {
        // TODO : Implement API call to create quiz
        console.log("Creating quiz",quizData);
        navigate('/admin/dashboard');
    };

    return(
        <div>
            <h1 className="text-2xl font-bold mb-6">Create new quiz</h1>
            <QuizForm onSubmit={handleSubmit}></QuizForm>
        </div>
    )

}