import MultipleChoiceOption from "./MultipleChoiceOption"
export default function GradedExamQuestion({ question, result, answer }) {
    const tag = `Q${question.id} • ${question.type}`
    const tagColor = question.type === "Multiple choice" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
    let feedbackColor;
    if (result.score === 0) {
        feedbackColor = "border-red-600 bg-red-50 text-red-900"
    } else if (result.score === 0.5) {
        feedbackColor = "border-amber-600 text-amber-800 bg-amber-50"
    } else {
        feedbackColor = "border-green-600 bg-green-50 text-green-900"
    }

    return <div className="flex flex-col gap-3 bg-white p-10 shadow-md rounded-2xl w-1/2">
        <div className = "flex justify-between items-center">
            <span className={`text-xs p-1 w-fit rounded-xl transition duration-150 ease hover:scale-102 ${tagColor}`}>{tag}</span>
            <span className={`${feedbackColor} text-xs p-2 border-1 rounded-xl ease hover:scale-102`}>{`${result.score}/1`}</span>
        </div>
        <p className="font-bold">{question.questionTitle}</p>

        {question.type === "Multiple choice" ? <div className="flex flex-col gap-3">
            {question.options.map((o, i) => {
                return <MultipleChoiceOption key={i} isDisabled={true} index={i} option={o} id={question.id} isSelected={o === answer} isCorrect={result.score} />
            })}
            {result.score === 0 ?
                <div className="border p-2 rounded-lg border-green-600 bg-green-50 text-green-900 ease">
                    <p className="text-xs font-semibold">Correct Answer:</p>
                    <p className="text-sm">{result.answer}</p>
                </div> : ""
            }
        </div> :
            <>
                <textarea value={answer ? answer : ""} disabled className="border-1 border-mist-300 p-2 rounded-lg bg-mist-100" ></textarea>
                {result.score !== 1 ? <div className="border p-2 rounded-lg border-green-600 bg-green-50 text-green-900 ease">
                    <p className="text-xs font-semibold">Sample answer:</p>
                    <p className="text-sm"> {result.answer}</p>
                </div> : ""}
                <div className={`border p-2 rounded-lg  ${feedbackColor}`}>
                    <p className="text-xs font-semibold">Feedback:</p>
                    <p className="text-sm"> {result.feedback}</p>
                </div>
            </>
        }
    </div >
}
