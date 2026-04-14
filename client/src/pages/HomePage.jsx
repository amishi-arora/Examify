import Header from "../components/Header";
import FileUpload from "../components/FileUpload"

export default function HomePage({ setQuestions }) {
    return (
        <main className="flex flex-col min-h-screen bg-stone-50 p-15">
            <Header title="AI Powered Exam Generator" subtitle="Study for your next exam with ease" />
            <FileUpload setQuestions={setQuestions} />
        </main>
    )
}