import { useNavigate } from "react-router-dom";

function getScoreColour(ratio) {
    if (ratio <= 0.45) return "border-red-600 bg-red-50 text-red-900";
    else if (ratio <= 0.65) return "border-amber-600 text-amber-800 bg-amber-50";
    else return "border-green-600 bg-green-50 text-green-900";
}

export default function RecentExam({ title, questions, difficulty, date, results, studentAnswers, insights }) {
    const score = Object.values(results).reduce((sum, r) => sum + r.score, 0);
    const colour = getScoreColour(score / questions.length);
    const navigate = useNavigate();

    function navigateToResultsPage() {
        navigate("/results", {
            state: { examQuestions: { questions }, examResults: results, examAnswers: studentAnswers, insights: insights }
        });
    }

    return (
        <div onClick={navigateToResultsPage} className="flex flex-row justify-between items-center bg-white p-4 shadow-md rounded-2xl hover:scale-102 cursor-pointer">
            <div className="flex flex-col gap-1">
                <p>{title}</p>
                <p className="text-xs text-gray-500">{`${questions.length} questions • ${difficulty} • ${date}`}</p>
            </div>
            <span className={`text-sm h-fit w-fit px-2 py-1 rounded-xl transition duration-150 ease border ${colour}`}>{`${score}/${questions.length}`}</span>
        </div>
    )
}