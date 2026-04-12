import MultipleChoiceOption from "./MultipleChoiceOption"

export default function ExamQuestion({ question }) {
    const tag = `Q${question.id} • ${question.type}`
    const tagColor = question.type === "Multiple choice" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"

    return <div className="flex flex-col gap-3 bg-white p-10 shadow-md rounded-2xl w-1/2">
        <span className={`text-xs p-1 w-fit rounded-xl transition duration-150 ease hover:scale-102 ${tagColor}`}>{tag}</span>
        <p className="font-bold">{question.questionTitle}</p>

        {question.type === "Multiple choice" ? <form className="flex flex-col gap-3">
            {question.options.map((o, i) => <MultipleChoiceOption key={i} option={o} id={i} />)}
        </form> :
            <textarea placeholder="Type your answer here" className="border-1 border-mist-300 p-2 rounded-lg bg-mist-100" ></textarea>
        }
    </div >
}