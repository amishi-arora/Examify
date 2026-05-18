import Header from "../components/Header";
import FileUpload from "../components/FileUpload"

export default function HomePage({ setExamQuestions }) {
    const greeting = `Welcome back ${localStorage.getItem("name")}`
    return (
        <main className="flex flex-col min-h-screen bg-stone-50 p-15 justify-center items-center gap-10">
            <Header title = {greeting} subtitle = "Are you ready to prepare for your next exam?" />
            <FileUpload setExamQuestions={setExamQuestions} />
        </main>
    )
}