import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gradeExam } from "../api.js";
import ExamQuestion from "../components/ExamQuestion"
import Header from "../components/Header"

export default function ExamPage({ studentAnswers, examQuestions, setExamAnswers, setExamResults }) {
    const navigate = useNavigate();
    const [grading, setGrading] = useState(false);

    async function handleSubmit() {
        setGrading(true);
        const results = await gradeExam(studentAnswers, examQuestions); 
        setExamResults(results);
        setGrading(false);
        navigate("/results");
    }

    function handleAnswer(question, answer) {
        setExamAnswers(prev => ({ ...prev, [question]: answer }));
    }

    return <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
        <Header title="Practice Exam" />
        {examQuestions.questions.map((q, i) => <ExamQuestion key={i} question={q} handleAnswer={handleAnswer}/>)}
        <button disabled={grading} onClick={handleSubmit} className="cursor-pointer bg-blue-500 text-white py-3 px-9 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-default">
            {grading ? "Grading..." : "Submit Exam"}
        </button>
    </main>
}
