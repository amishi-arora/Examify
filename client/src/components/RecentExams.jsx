import RecentExam from "./RecentExam"

export default function RecentExams({ exams }) {
    return <div className="flex flex-col gap-4 w-full max-w-xl">
        {exams.length > 0 && <p className="text-sm ">Your past exams</p>}
        {exams.map((e) =>
            <RecentExam key={e.examId} id={e.examId} title={e.title} questions={e.questions} difficulty={e.settings.difficulty} date={e.date} results={e.results} />
        )}
    </div>
}