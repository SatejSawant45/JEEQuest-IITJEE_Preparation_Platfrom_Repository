import react, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import QuizForm from '../../nonshadcncomponants/QuizForm';
import { Plus } from 'lucide-react';
import Navbar from '../../nonshadcncomponants/Navbar';

export default function EditQuiz()
{
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz , setQuiz] = useState(null);

    useEffect(()=>{
        // TODO: Fetch quiz data from API
        // Temporary mock data

        setQuiz({
            id: '1',
            title: 'Physics Mechanics',
            description: 'Test your knowledge of Newton\'s laws and kinematics',
            duration: 60,
            questions: [],
            createdBy: 'admin1',
            createdAt: new Date(),
        });

        
    },[id]);    

    const handleSubmit = async(quizData) => {
        // TODO: Implement API call to update quiz

        console.log('Updating quiz :',{...quizData,id});
        navigate('/admin/dashboard');
    };


    if(!quiz){
        return <div>Loading...</div>
    }

    return (
        
        <div>
            <Navbar></Navbar>
            <div className="m-8">
                <h1 className='text-2xl font-bold mb-6'>Edit Quiz</h1>
                <QuizForm initialData={quiz} onSubmit={handleSubmit}></QuizForm>
            </div>
        </div>
    )
}