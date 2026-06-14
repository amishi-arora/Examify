import { useNavigate } from "react-router-dom";
import * as constants from "../constants.js";

function getScoreColour(ratio) {
    if (ratio <= 0.45) return constants.SCORE_COLORS.LOW.full;
    else if (ratio <= 0.65) return constants.SCORE_COLORS.MID.full;
    else return constants.SCORE_COLORS.HIGH.full;
}

export default function RecentExam({ id, title, questions, difficulty, date, results }) {
    const score = Object.values(results).reduce((sum, r) => sum + r.score, 0);
    const colour = getScoreColour(score / questions.length);
    date = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const navigate = useNavigate();

    function navigateToResultsPage() {
        navigate("/results", {
            state: { examId: id }
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