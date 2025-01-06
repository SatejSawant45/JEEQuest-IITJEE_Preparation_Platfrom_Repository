// import { Clock , Users } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Timer } from 'lucide-react';
// import { ListMinus } from 'lucide-react';

// export default function QuizCard(){

//     return(

//         <div className='bg-slate-200  border-0 rounded-xl shadow-lg p-1'>
//             <div className='flex items-center justify-between '>

//                     <div className='mx-5 my-5'>
//                             <h1 className='text-2xl font-semibold'>Physics mechanics</h1>
//                     </div>
//                     <div className="flex items-center justify-between  mx-2 px-2  ">
//                         <div className='mx-5 bg-blue-300 px-6 text-blue-600 py-2 border-0 rounded-lg font-semibold'>
//                             Edit
//                         </div>
//                         <div className='mx-5 bg-red-300 px-6 text-red-600 py-2 border-0 rounded-lg font-semibold '>
//                             Delete
//                         </div>
//                     </div>
//             </div>
//             <p className='my-2 mx-4 my-4 text-xl'>
//             Test your knowledge of Newton's laws and kinematics
//             </p>

//             <ul>
//                 <li className=' my-4 mx-4 flex items-center'>
//                     <Timer className='mx-2'></Timer>
//                     60 minutes
//                 </li>
//                 <li className='my-4 mx-4 flex items-center'>
//                     <ListMinus className='mx-2'></ListMinus>
//                     120 questions
//                 </li>
//             </ul>
//         </div>
//     )
// }

import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizCard({ quiz, showActions = true }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
      <p className="text-gray-600 mb-4">{quiz.description}</p>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{quiz.duration} minutes</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{quiz.questions.length} questions</span>
        </div>
      </div>

      {showActions && (
        <Link
          to={`/quiz/${quiz.id}`}
          className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Start Quiz
        </Link>
      )}
    </div>
  );
}
