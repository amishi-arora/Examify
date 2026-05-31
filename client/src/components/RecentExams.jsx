import RecentExam from "./RecentExam"

export default function RecentExams({exams}) {
    return <div className="flex flex-col gap-4 w-full max-w-xl">
        {!(exams.length === 0) && <p className="text-sm ">Your past exams</p>}
        {exams.map((d) =>
            <RecentExam key={d.title} title={d.title} questions={d.questions} difficulty={d.difficulty} date={d.date}/>
        )}
    </div>
}