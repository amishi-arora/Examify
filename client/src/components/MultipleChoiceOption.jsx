export default function MultipleChoiceOption({index, option, id, onSelect}) {
    return (
        <div className="flex border-1 border-mist-300 p-1.5 rounded-lg">
            <input onChange = {onSelect} type="radio" id={`${id} - ${index}`} name={id} className="cursor-pointer"/>
            <label htmlFor={`${id} - ${index}`} className="font-medium flex-1 cursor-pointer ml-3">{option}</label>
        </div>
    )
}