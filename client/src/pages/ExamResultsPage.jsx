import Header from "../components/Header"
import GradedExamQuestion from "../components/GradedExamQuestion"
export default function ExamResultsPage({ examQuestions, examAnswers, examResults }) {
    let totalScore = 0;
    const numberOfQuestions = examQuestions.questions.length;
    let feedback = "Great work! You have a solid understanding of the material!"
    let color = "text-green-900"; 
    for (const r of Object.values(examResults)) {
        totalScore += r.score;
    }
    if (totalScore / numberOfQuestions <= 0.35) {
        feedback = "Keep going! Take some time to review the material and try again."
        color = "text-red-900"
    } else if (totalScore / numberOfQuestions <= 0.65) {
        feedback = "Good effort! there are some topics worth reviewing!"
        color = "text-amber-800"
    } 
    return (
        <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
            <Header title="Exam Results"></Header>
            <div className="flex flex-col items-center bg-blue-100 gap-1 bg-white p-4 shadow-md rounded-2xl w-1/3">
                <p className="text-sm">Your score</p>
                <p className={`text-5xl ${color}`}>{`${totalScore}/${numberOfQuestions}`}</p>
                <p className={`text-sm ${color}`}>{feedback}</p>
            </div>
            {examQuestions.questions.map((q, i) => <GradedExamQuestion key={i} question={q} result={examResults[q.id]} answer={examAnswers[q.id]} />)}
        </main>
    )
}