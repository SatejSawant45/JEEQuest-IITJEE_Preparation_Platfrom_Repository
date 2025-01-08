
import './App.css'
import Home from './pages/Home.jsx'
import { BrowserRouter } from 'react-router-dom';
import QuizCard from './componants/QuizCard.jsx';
import AuthForm from './componants/AuthFrom.jsx';
import LeaderboardTable from './componants/LeaderboardTable.jsx';


function App() 
{
  

  return (
    <div>
        <LeaderboardTable ></LeaderboardTable>
    </div>
  );
}

export default App
