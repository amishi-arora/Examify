import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamQuestion from "../components/ExamQuestion"
import Header from "../components/Header"

export default function ExamPage({ studentAnswers, examQuestions, setExamAnswers, setExamResults }) {
    const navigate = useNavigate();
    const [grading, setGrading] = useState(false);

    async function handleSubmit() {
        setGrading(true);
        const res = await fetch("http://localhost:3001/api/grade-exam", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentAnswers, examQuestions })
        });
        const results = await res.json();
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
        <button disabled={grading} onClick={handleSubmit} className="cursor-pointer bg-blue-500 text-white py-3 px-9 rounded-xl hover:bg-blue-700">
            {grading ? "Grading..." : "Submit Exam"}
        </button>
    </main>
}
