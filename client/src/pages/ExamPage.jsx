import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateInsights, gradeExam, saveExam } from "../api.js";
import ExamQuestion from "../components/ExamQuestion"
import Header from "../components/Header"
import ErrorMessage from "../components/ErrorMessage.jsx";
import BackButton from "../components/BackButton.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import CountDown from "../components/CountDown.jsx";
import ExamSettings from "../components/ExamSettings.jsx";

export default function ExamPage({ examQuestions }) {
    const navigate = useNavigate();
    const [grading, setGrading] = useState(false);
    const [error, setError] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState({});
    const numberOfAnswers = (Object.values(studentAnswers).filter(x => x != "" && x != null)).length;


    // Redirect to home on refresh 
    if (!Object.keys(examQuestions).length) {
        return <Navigate to="/home" />;
    }

    async function handleSubmit() {
        setGrading(true);
        setError(null);
        try {
            const results = await gradeExam(studentAnswers, examQuestions);
            const insights = await generateInsights(examQuestions, studentAnswers, results);
            const { examId } = await saveExam(examQuestions.title, examQuestions.questions, examQuestions.difficulty, results, studentAnswers, insights);

            navigate("/results", {
                state: { examId },
                replace: true
            });
        } catch (err) {
            console.log(err);
            setGrading(false);
            setError(err.message);
        }
    }

    function handleAnswer(question, answer) {
        setStudentAnswers(prev => ({ ...prev, [question]: answer }));
    }

    return <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
        <div className="fixed top-4 left-4">
            <BackButton to="/home" label="← Back to home"></BackButton>
        </div>
        <div className="fixed top-1/4 left-10 flex flex-col gap-5 w-1/6 bg-white p-8 shadow-md rounded-2xl">
            {examQuestions.time != 0 && examQuestions.time != null && <CountDown time={examQuestions.time} onTimeout={handleSubmit} />}
            {examQuestions.time != 0 && examQuestions.time != null && <hr className="border-gray-400" />}
            <ProgressBar questions={examQuestions.questions.length} answered={numberOfAnswers} />
        </div>


        <Header title={examQuestions.title} />

        {examQuestions.questions.map((q, i) => <ExamQuestion key={i} question={q} handleAnswer={handleAnswer} />)}
        <button disabled={grading} onClick={handleSubmit} className="cursor-pointer bg-blue-500 text-white py-3 px-9 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-default flex items-center justify-center w-48">
            {grading ? <span className="mx-auto animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : "Submit Exam"}
        </button>

        {/* Error message in case exam grading fails */}
        {error && <ErrorMessage message={error} />}
    </main>
}
