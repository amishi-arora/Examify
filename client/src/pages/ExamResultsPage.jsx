import Header from "../components/Header"
import GradedExamQuestion from "../components/GradedExamQuestion"

function getScoreFeedback(ratio) {
    if (ratio <= 0.45) return { feedback: "Keep going! Take some time to review the material and try again", colour: "text-red-900" }; 
    else if (ratio <= 0.65) return { feedback: "Good effort! There are some topics worth reviewing.", colour: "text-amber-800" }; 
    else return { feedback: "Great work! You have a solid understanding of the material!", colour: "text-green-900"}
}
export default function ExamResultsPage({ examQuestions, examAnswers, examResults }) {
    const totalScore = Object.values(examResults).reduce((sum, r) => sum + r.score, 0); 
    const numberOfQuestions = examQuestions.questions.length;
    const scoreFeedback = getScoreFeedback(totalScore/numberOfQuestions); 
    return (
        <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
            <Header title="Exam Results"/>
            
            <div className="flex flex-col items-center gap-1 bg-white p-4 shadow-md rounded-2xl w-1/3">
                <p className="text-sm">Your score</p>
                <p className={`text-5xl ${scoreFeedback.colour}`}>{`${totalScore}/${numberOfQuestions}`}</p>
                <p className={`text-sm ${scoreFeedback.colour}`}>{scoreFeedback.feedback}</p>
            </div>

            {examQuestions.questions.map((q, i) => <GradedExamQuestion key={i} studentAnswer={examAnswers[q.id]} question={q} result={examResults[q.id]} />)}
        </main>
    )
}

