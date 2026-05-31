import { useState, useEffect } from "react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload"
import RecentExams from "../components/RecentExams";
import { getExams } from "../api.js";
export default function HomePage({ setExamQuestions }) {
    const [recentExams, setRecentExams] = useState([]);
    const greeting = `Welcome back, ${localStorage.getItem("name")}`

    useEffect(() => {
        async function fetchExams() {
            try {
                const exams = await getExams();
                setRecentExams(exams);
            } catch (err) {
                console.error(err);
            }
        }
        fetchExams();
    }, []);

    return (
        <main className="flex flex-col min-h-screen bg-stone-50 p-15 justify-center items-center gap-10">
            <Header title={greeting} subtitle="Are you ready to prepare for your next exam?" />
            <FileUpload setExamQuestions={setExamQuestions} />
            <RecentExams exams={recentExams} />
        </main>
    )
}