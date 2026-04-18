import { useNavigate } from "react-router-dom";
import ExamQuestion from "../components/ExamQuestion"
import Header from "../components/Header"
export default function ExamPage({ answers, examQuestions, updateAnswers, updateResults }) {
    const navigate = useNavigate();
    function setAnswers(question, answer) {
        updateAnswers(prev => ({ ...prev, [question]: answer }));
    }
    async function handleSubmit() {
        const res = await fetch("http://localhost:3001/api/grade-exam", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ answers, examQuestions })
        });

        const results = await res.json();
        updateResults(results);
        navigate("/results");
    }

    return <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
        <Header title="Practice Exam" />
        {examQuestions.questions.map((q, i) => <ExamQuestion onAnswer={setAnswers} key={i} question={q} />)}
        <button onClick={handleSubmit} className="cursor-pointer bg-blue-500 text-white py-3 px-9 rounded-xl hover:bg-blue-700">Submit Exam</button>
    </main>
}
