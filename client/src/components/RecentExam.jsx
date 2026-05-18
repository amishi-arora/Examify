export default function RecentExam({ title, questions, difficulty, date, score }) {
    return (
        <div className="flex flex-row justify-between items-center bg-white p-4 shadow-md rounded-2xl hover:scale-102 cursor-pointer">
            <div className="flex flex-col gap-1">
                <p>{title}</p>
                <p className="text-xs text-gray-500">{`${questions} questions•${difficulty}•${date}`}</p>
            </div>
            <span className="text-sm h-fit w-fit px-2 py-1 rounded-xl transition duration-150 ease bg-blue-100 text-blue-800">{`${score}/${questions}`}</span>
        </div>
    )
}