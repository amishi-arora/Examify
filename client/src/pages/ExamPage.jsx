import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateInsights, gradeExam, saveExam } from "../api.js";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExamQuestion from "../components/ExamQuestion"
import Header from "../components/Header"
import ErrorMessage from "../components/ErrorMessage.jsx";
import BackButton from "../components/BackButton.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import CountDown from "../components/CountDown.jsx";
import BlankExamPdf from "../components/BlankExamPdf";

export default function ExamPage({ exam }) {
    const navigate = useNavigate();
    const [grading, setGrading] = useState(false);
    const [error, setError] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState({});
    const numberOfAnswers = (Object.values(studentAnswers).filter(x => x != "" && x != null)).length;


    // Redirect to home on refresh 
    if (!Object.keys(exam).length) {
        return <Navigate to="/home" />;
    }

    async function handleSubmit() {
        setGrading(true);
        setError(null);
        try {
            const results = await gradeExam(studentAnswers, exam);
            const insights = await generateInsights(exam, studentAnswers, results);
            const { examId } = await saveExam(exam.title, exam.questions, exam.settings, results, studentAnswers, insights, exam.s3Keys);

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
        <div className="fixed top-4 flex w-[98%] justify-between items-start">
            <BackButton to="/home" label="← Back to home"></BackButton>

            {exam && <PDFDownloadLink
                document={<BlankExamPdf examData={exam} />}
                fileName="blank-exam.pdf">
                {({ loading }) => (
                    <button className="w-35 cursor-pointer p-1 bg-white border-1 rounded-xl ease hover:scale-102 border-stone-400 text-stone-800 text-xs shadow-md">
                        Download Blank Exam
                    </button>
                )}
            </PDFDownloadLink>}
        </div>
        <div className="fixed top-1/4 left-10 flex flex-col gap-5 w-1/6 bg-white p-8 shadow-md rounded-2xl">
            {exam.settings.time != 0 && exam.settings.time != null && <CountDown time={exam.settings.time} onTimeout={handleSubmit} />}
            {exam.settings.time != 0 && exam.settings.time != null && <hr className="border-gray-400" />}
            <ProgressBar questions={exam.questions.length} answered={numberOfAnswers} />
        </div>


        <Header title={exam.title} />

        {exam.questions.map((q, i) => <ExamQuestion key={i} question={q} handleAnswer={handleAnswer} />)}
        <button disabled={grading} onClick={handleSubmit} className="cursor-pointer bg-blue-500 text-white py-3 px-9 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-default flex items-center justify-center w-48">
            {grading ? <span className="mx-auto animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : "Submit Exam"}
        </button>

        {/* Error message in case exam grading fails */}
        {error && <ErrorMessage message={error} />}
    </main>
}
