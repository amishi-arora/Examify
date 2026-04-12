import ExamQuestion from "./ExamQuestion"
import Header from "./Header"
export default function Exam({ examQuestions }) {
    return <div className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
       <Header title = "Practice Exam"/>
        {examQuestions.questions.map((q, i) => <ExamQuestion key = {i} question = {q}/>)}
    </div>
}