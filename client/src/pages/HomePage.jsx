import { useState, useEffect } from "react";
import { getExams } from "../api.js";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload"
import RecentExams from "../components/RecentExams";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function HomePage({ setExamQuestions }) {
    const [recentExams, setRecentExams] = useState([]);
    const [error, setError] = useState(null);
    const greeting = `Welcome back, ${localStorage.getItem("name")}`

    useEffect(() => {
        async function fetchExams() {
            setError(null);
            try {
                const exams = await getExams();
                setRecentExams(exams);
            } catch (err) {
                console.error(err);
                setError(err.message)
            }
        }
        fetchExams();
    }, []);

    return (
        <main className="flex flex-col min-h-screen bg-stone-50 p-15 justify-center items-center gap-10">
            <Header title={greeting} subtitle="Are you ready to prepare for your next exam?" />
            <FileUpload setExamQuestions={setExamQuestions} />
            {error
                ? <ErrorMessage message={error} />
                : <RecentExams exams={recentExams} />}
        </main>
    )
}