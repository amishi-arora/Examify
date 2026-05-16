import Header from "../components/Header";
import FileUpload from "../components/FileUpload"

export default function HomePage({ setExamQuestions }) {
    return (
        <main className="flex flex-col min-h-screen bg-stone-50 p-15 justify-center items-center gap-10">
            <FileUpload setExamQuestions={setExamQuestions} />
        </main>
    )
}