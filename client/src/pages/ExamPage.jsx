import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateInsights, gradeExam, saveExam } from "../api.js";
import ExamQuestion from "../components/ExamQuestion"
import Header from "../components/Header"
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function ExamPage({ studentAnswers, examQuestions, setExamAnswers }) {
    const navigate = useNavigate();
    const [grading, setGrading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit() {
        setGrading(true);
        try {
            const results = await gradeExam(studentAnswers, examQuestions);
            const insights = await generateInsights(examQuestions, studentAnswers, results);
            const { id } = await saveExam(examQuestions.title, examQuestions.questions, examQuestions.difficulty, results, studentAnswers, insights);

            navigate("/results", {
                state: { examId: id }
            });
        } catch (err) {
            console.log(err);
            setError("Failed to grade exam. Please try again.");
        } finally {
            setGrading(false);
        }

    }

    function handleAnswer(question, answer) {
        setExamAnswers(prev => ({ ...prev, [question]: answer }));
    }

    return <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
        <Header title={examQuestions.title} />
        {examQuestions.questions.map((q, i) => <ExamQuestion key={i} question={q} handleAnswer={handleAnswer} />)}
        <button disabled={grading} onClick={handleSubmit} className="cursor-pointer bg-blue-500 text-white py-3 px-9 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-default">
            {grading ? "Grading..." : "Submit Exam"}
        </button>

        {/* Error message in case exam grading fails */}
        {error && <ErrorMessage message={error} />}
    </main>
}
