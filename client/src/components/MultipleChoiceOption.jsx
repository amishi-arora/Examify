export default function MultipleChoiceOption({option, id}) {
    return (
        <div className="flex border-1 border-mist-300 p-1.5 rounded-lg">
            <input type="radio" id={id} name="option" className="cursor-pointer"/>
            <label htmlFor={id} className="font-medium flex-1 cursor-pointer ml-3">{option}</label>
        </div>
    )
}