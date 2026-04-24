import MultipleChoiceOption from "./MultipleChoiceOption"

export default function ExamQuestion({ question, handleAnswer }) {
    const tag = `Q${question.id} • ${question.type}`
    const tagColor = question.type === "Multiple choice" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"; 

    return <div className="flex flex-col gap-3 bg-white p-10 shadow-md rounded-2xl w-1/2">
        <span className={`text-xs p-1 w-fit rounded-xl transition duration-150 ease hover:scale-102 ${tagColor}`}>{tag}</span>
        <p className="font-bold">{question.questionText}</p>

        {question.type === "Multiple choice" ? <div className="flex flex-col gap-3">
            {question.options.map((o, i) => 
                <MultipleChoiceOption key={i} index={i} id={question.id} option={o} handleAnswer={() => handleAnswer(question.id, o)} />
            )}
        </div> :
            <textarea onChange={(e) => handleAnswer(question.id, e.target.value)} placeholder="Type your answer here" className="border-1 border-mist-300 p-2 rounded-lg bg-mist-100" ></textarea>
        }
    </div >
}


