import RecentExam from "./RecentExam"
const PLACEHOLDER_DATA = [{
    title: "Biology - Cell Division",
    questions: 8,
    difficulty: "Easy",
    date: "May 5,2026",
    score: 7
},
{
    title: "Chemistry - Organic Relations",
    questions: 10,
    difficulty: "Mixed",
    date: "May 15,2026",
    score: 8
},
{
    title: "Art - Shakespear",
    questions: 11,
    difficulty: "Medium",
    date: "April 22,2026",
    score: 7
}]

export default function RecentExams() {
    return <div className="flex flex-col gap-4 w-full max-w-xl">
        <p className="text-sm ">Your past exams</p>
        {PLACEHOLDER_DATA.map((d) =>
            <RecentExam title={d.title} questions={d.questions} difficulty={d.difficulty} date={d.date} score={d.score} />
        )}
    </div>
}