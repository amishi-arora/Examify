import MultipleChoiceOption from "./MultipleChoiceOption"

export default function ExamQuestion({ question }) {
    const tag = `Q${question.id} • ${question.type}`
    let tagCSS = "";
    if (question.type === "Multiple choice") {
        tagCSS = "text-xs p-1 w-fit rounded-xl bg-blue-100 text-blue-800 transition duration-150 ease hover:scale-102"
    } else {
        tagCSS = "text-xs p-1 w-fit rounded-xl bg-emerald-100 text-emerald-800 transition duration-150 ease hover:scale-102"
    }

    return <div className="flex flex-col gap-3 bg-white p-10 shadow-md rounded-2xl w-1/2">
        <span className={tagCSS}>{tag}</span>
        <p className="font-bold">{question.questionTitle}</p>

        {question.type === "Multiple choice" && <form className="flex flex-col gap-3">
            {question.options.map((o, i) => <MultipleChoiceOption key = {i} option={o} id = {i}/>)}
        </form>}

        {question.type === "Short answer" &&
            <textarea placeholder="Type your answer here" className="border-1 border-mist-300 p-2 rounded-lg bg-mist-100" ></textarea>}
    </div >
}