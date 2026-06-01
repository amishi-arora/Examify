import { useLocation } from "react-router-dom";

import Header from "../components/Header"
import GradedExamQuestion from "../components/GradedExamQuestion"
import ScoreBanner from "../components/ScoreBanner";

export default function ExamResultsPage({ examQuestions, examAnswers, examResults }) {
    const { state } = useLocation();

    // Use navigation state if available. Otherwise, use props 
    examQuestions = state?.examQuestions || examQuestions;
    examResults = state?.examResults || examResults;
    examAnswers = state?.examAnswers || examAnswers;

    const score = Object.values(examResults).reduce((sum, r) => sum + r.score, 0);
    const total = examQuestions.questions.length;

    return (
        <main className="flex flex-col items-center min-h-screen bg-stone-50 p-15 gap-10">
            <Header title="Exam Results" />

            <ScoreBanner score={score} total={total} />

            {examQuestions.questions.map((q, i) => <GradedExamQuestion key={i} studentAnswer={examAnswers[q.id]} question={q} result={examResults[q.id]} />)}
        </main>
    )
}

