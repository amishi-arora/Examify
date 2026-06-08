import MultipleChoiceOption from "./MultipleChoiceOption"

function getScoreColor(score) {
    if (score === 0) {
        return "border-red-600 bg-red-50 text-red-900";
    } else if (score === 0.5) {
        return "border-amber-600 text-amber-800 bg-amber-50";
    } else {
        return "border-green-600 bg-green-50 text-green-900";
    }
}

export default function GradedExamQuestion({ question, studentAnswer, result }) {
    const tag = `Q${question.id} • ${question.type}`
    const tagColor = question.type === "Multiple choice" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";

    return <div className="flex flex-col gap-3 bg-white p-8 shadow-md rounded-2xl w-2/3 min-[1500px]:w-1/2">
        <div className="flex justify-between items-center">
            <span className={`text-xs p-1 w-fit rounded-xl transition duration-150 ease hover:scale-102 ${tagColor}`}>{tag}</span>
            <span className={`${getScoreColor(result.score)} text-xs p-2 border-1 rounded-xl ease hover:scale-102`}>{`${result.score}/1`}</span>
        </div>
        <p className="font-bold">{question.questionText}</p>

        {question.type === "Multiple choice" ?
            <div className="flex flex-col gap-3">
                {question.options.map((o, i) =>
                    <MultipleChoiceOption key={i} isDisabled={true} index={i} option={o} id={question.id} isSelected={o === studentAnswer} isCorrectAnswer={o === result.correctAnswer} />
                )}

                {/* Only show correct multiple choice answer if student got it wrong  */}
                {result.score === 0 &&
                    <div className="border p-2 rounded-lg border-green-600 bg-green-50 text-green-900 ease">
                        <p className="text-xs font-semibold">Correct Answer:</p>
                        <p className="text-sm">{result.correctAnswer}</p>
                    </div>
                }
            </div> :
            <>
                {/* Student's submitted short answer */}
                <textarea value={studentAnswer || ""} disabled className="border-1 border-mist-300 p-2 rounded-lg bg-mist-100" ></textarea>

                {/* Only show sample answer if student didn't get full marks */}
                {result.score !== 1 &&
                    <div className="border p-2 rounded-lg border-green-600 bg-green-50 text-green-900 ease">
                        <p className="text-xs font-semibold">Sample answer:</p>
                        <p className="text-sm">{result.correctAnswer}</p>
                    </div>}

                {/* AI Generated feedback about the student answer */}
                <div className={`border p-2 rounded-lg ${getScoreColor(result.score)}`}>
                    <p className="text-xs font-semibold">Feedback:</p>
                    <p className="text-sm">{result.feedback}</p>
                </div>
            </>
        }
    </div >
}
