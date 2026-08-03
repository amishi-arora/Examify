import { useState, useEffect } from "react";
import { getDocuments, regenerateExam } from "../api.js";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage.jsx";

export default function InsightsCard({ exam, setExamQuestions }) {
    const insights = exam.insights;
    const navigate = useNavigate();
    const [generating, setGenerating] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);
    const relevantDocuments = documents.filter(doc => exam.documentKeys.includes(doc.documentId));
    const canRegenerate = relevantDocuments.length > 0 &&
        relevantDocuments.every(doc => doc.status === "READY");
    const failed = relevantDocuments.some(doc => doc.status === "FAILED");
    const buttonText = failed ? "Some documents failed to process" :
        canRegenerate ? "Regenerate Exam Based on Weak Topics" : "Preparing Study Materials..."

    useEffect(() => {
        let interval;

        async function fetchDocuments() {
            setError(null);
            try {
                const docs = await getDocuments();
                setDocuments(docs);

                const relevant = docs.filter(doc => exam.documentKeys.includes(doc.documentId));
                const allSettled = relevant.length > 0 &&
                    relevant.every(doc => doc.status === "READY" || doc.status === "FAILED");

                if (allSettled && interval) {
                    clearInterval(interval);
                }
            } catch (err) {
                console.error(err);
                setError(err.message)
            }
        }
        fetchDocuments();

        interval = setInterval(fetchDocuments, 5000);
        return () => clearInterval(interval);
    }, [exam]);

    async function handleRegenerate() {
        setGenerating(true);
        try {
            const examData = await regenerateExam(exam.documentKeys, insights.weakTopics, exam.settings);
            setExamQuestions(examData);
            examData.s3Keys = exam.documentKeys;
            examData.settings = exam.settings;
            navigate("/exam");
        } catch (err) {
            console.error(err);
            setGenerating(false);
            setError(err.message);
        }

    }
    return <div className="flex flex-col gap-3 bg-white p-6 shadow-md rounded-2xl w-1/2">
        <p className="tracking-[0.05em] uppercase text-stone-400 text-sm">✨ AI Insights</p>

        <p className="text-stone-800">{insights.feedback}</p>

        <p className="text-sm text-green-900">Strong topics</p>
        <div className="flex flex-row gap-1">
            {insights.strongTopics?.map(s => <span key={s} className="rounded-xl px-2 bg-green-100 text-green-900 ease hover:scale-102 text-sm">{s}</span>)}
        </div>

        <p className="text-sm text-red-900">Needs review</p>
        <div className="flex flex-row gap-1">
            {insights.weakTopics?.map(w => <span key={w} className="rounded-xl px-2 bg-red-100 text-red-900 ease hover:scale-102 text-sm">{w}</span>)}
        </div>
        {insights.weakTopics ? <button onClick={handleRegenerate} disabled={generating || !canRegenerate} className="cursor-pointer bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition flex items-center justify-center w-full mt-2 disabled:bg-gray-300 disabled:cursor-default" >
            {generating ? <span className="mx-auto animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> :
                buttonText}
        </button> : ""
        }
        {insights.weakTopics && !canRegenerate && !failed && <p className="text-xs font-light text-center">We're preparing your uploaded documents so you can regenerate questions based on the topics you struggled with</p>}
        {/* Error message in case exam generation fails */}
        {error && <ErrorMessage message={error} />}
    </div >

}
