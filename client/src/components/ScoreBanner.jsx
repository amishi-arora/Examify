import * as constants from "../constants.js"

function getScoreFeedback(ratio) {
    if (ratio <= 0.45) return { feedback: "Keep going! Take some time to review the material and try again", colour: constants.SCORE_COLORS.LOW.text };
    else if (ratio <= 0.65) return { feedback: "Good effort! There are some topics worth reviewing.", colour: constants.SCORE_COLORS.MID.text };
    else return { feedback: "Great work! You have a solid understanding of the material!", colour: constants.SCORE_COLORS.HIGH.text }
}

export default function ScoreBanner({ score, total }) {
    const ratio = score / total;
    const { feedback, colour } = getScoreFeedback(ratio);

    return (
        <div className="flex flex-col items-center gap-1 bg-white p-4 shadow-md rounded-2xl w-2/3 min-[1500px]:w-1/2">
            <p className="text-sm">Your score</p>
            <p className={`text-5xl ${colour}`}>{`${score}/${total}`}</p>
            <p className={`text-sm ${colour}`}>{feedback}</p>
        </div>
    )
}