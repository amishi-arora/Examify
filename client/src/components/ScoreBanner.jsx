export default function ScoreBanner({ score, total }) {
    const ratio = score / total;
    function getScoreFeedback(ratio) {
        if (ratio <= 0.45) return { feedback: "Keep going! Take some time to review the material and try again", colour: "text-red-900" };
        else if (ratio <= 0.65) return { feedback: "Good effort! There are some topics worth reviewing.", colour: "text-amber-800" };
        else return { feedback: "Great work! You have a solid understanding of the material!", colour: "text-green-900" }
    }

    const { feedback, colour } = getScoreFeedback(ratio);

    return (
        <div className="flex flex-col items-center gap-1 bg-white p-4 shadow-md rounded-2xl w-1/3">
            <p className="text-sm">Your score</p>
            <p className={`text-5xl ${colour}`}>{`${score}/${total}`}</p>
            <p className={`text-sm ${colour}`}>{feedback}</p>
        </div>
    )
}