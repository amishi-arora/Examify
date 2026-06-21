export default function ProgressBar({ questions, answered }) {
    return (
        <div className="flex flex-col gap-3 bg-white p-8 shadow-md rounded-2xl w-72 justify-center items-center">
            <div className="flex w-full flex-row justify-between text-sm">
                <p>Progress</p>
                <p className="font-bold">{answered} / {questions}</p>
            </div>
            <div className="bg-gray-200 w-full h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answered / questions) * 100}%` }} />
            </div>
        </div>

    )
}