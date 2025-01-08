
export default function LeaderboardTable()
{
    const entries = [
        {
          userId: 'user1',
          userName: 'John Doe',
          quizId: 'quiz101',
          quizTitle: 'Mathematics Basics',
          score: 95,
          completedAt: '2024-12-20T14:48:00.000Z',
        },
        {
          userId: 'user2',
          userName: 'Jane Smith',
          quizId: 'quiz102',
          quizTitle: 'Physics Fundamentals',
          score: 89,
          completedAt: '2024-12-18T10:15:00.000Z',
        },
        {
          userId: 'user3',
          userName: 'Michael Johnson',
          quizId: 'quiz103',
          quizTitle: 'Chemistry Reactions',
          score: 92,
          completedAt: '2024-12-19T08:30:00.000Z',
        },
        {
          userId: 'user4',
          userName: 'Emily Davis',
          quizId: 'quiz104',
          quizTitle: 'Programming Concepts',
          score: 88,
          completedAt: '2024-12-21T12:45:00.000Z',
        }];
    
    return(
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quiz
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {entries.map((entry,index)=>(
                        <tr key={`${entry.userId}-${entry.quizId}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{index+1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {entry.userName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {entry.quizTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {entry.score}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(entry.completedAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}