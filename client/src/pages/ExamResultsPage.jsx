import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getExam } from "../api";
import Header from "../components/Header"
import GradedExamQuestion from "../components/GradedExamQuestion"
import ScoreBanner from "../components/ScoreBanner";
import InsightsCard from "../components/InsightsCard";

export default function ExamResultsPage() {
    const { state } = useLocation();
    const [exam, setExam] = useState(null);

    useEffect(() => {
        async function fetchExam() {
            const data = await getExam(state.examId);
            setExam(data);
        }
        fetchExam();
    }, []);

    const score = exam ? Object.values(exam.results).reduce((sum, r) => sum + r.score, 0) : 0;
    const total = exam ? exam.questions.length : 0;

    return (
        <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
            <Header title="Exam Results" />

            <ScoreBanner score={score} total={total} />

            {exam && <InsightsCard insights={exam.insights} />}

            {exam && exam.questions.map((q, i) => <GradedExamQuestion key={i} studentAnswer={exam.studentAnswers[q.id]} question={q} result={exam.results[q.id]} />)}
        </main>
    )
}

