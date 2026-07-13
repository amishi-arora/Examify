import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getExam } from "../api";
import { PDFDownloadLink } from '@react-pdf/renderer';
import Header from "../components/Header"
import GradedExamQuestion from "../components/GradedExamQuestion"
import ScoreBanner from "../components/ScoreBanner";
import InsightsCard from "../components/InsightsCard";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";
import ExamResultsPDF from "../components/ExamResultsPdf";
import BlankExamPdf from "../components/BlankExamPdf";

export default function ExamResultsPage({ setExamQuestions }) {
    const { state } = useLocation();
    const [exam, setExam] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchExam() {
            setError(null);
            try {
                const data = await getExam(state.examId);
                setExam(data);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        }
        fetchExam();
    }, []);

    // If someone navigates to /results without state.examId, return home 
    if (!state?.examId) return <Navigate to="/home" />;

    const score = exam ? Object.values(exam.results).reduce((sum, r) => sum + r.score, 0) : 0;
    const total = exam ? exam.questions.length : 0;

    return (
        <main className="flex flex-col min-h-screen items-center bg-stone-50 p-15 gap-10">
            <div className="fixed top-4 flex w-[98%] justify-between items-start">
                <BackButton to="/home" label="← Back to home"></BackButton>

                <div className="flex flex-col items-start gap-2 text-xs">
                    {exam && <PDFDownloadLink
                        document={<ExamResultsPDF examData={exam} />}
                        fileName="exam-results.pdf">
                        {({ loading }) => (
                            <button className="w-35 cursor-pointer p-1 bg-white border-1 rounded-xl ease hover:scale-102 border-stone-400 text-stone-800 shadow-md">
                                Download Results
                            </button>
                        )}
                    </PDFDownloadLink>}
                    {exam && <PDFDownloadLink
                        document={<BlankExamPdf examData={exam} />}
                        fileName="blank-exam.pdf">
                        {({ loading }) => (
                            <button className="w-35 cursor-pointer p-1 bg-white border-1 rounded-xl ease hover:scale-102 border-stone-400 text-stone-800 shadow-md">
                                Download Blank Exam
                            </button>
                        )}
                    </PDFDownloadLink>}
                </div>
            </div>
            <div className="w-[75%]">
                {exam && <Header title={`Exam Results: ${exam.title}`} />}
            </div>

            {(!exam && !error) && <span className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent" />}

            {exam && <ScoreBanner score={score} total={total} />}

            {exam && <InsightsCard exam={exam} setExamQuestions={setExamQuestions} />}

            {exam && exam.questions.map((q, i) => <GradedExamQuestion key={i} studentAnswer={exam.studentAnswers[q.id]} question={q} result={exam.results[q.id]} />)}

            {error && <ErrorMessage message={error} />}
        </main>
    )
}

