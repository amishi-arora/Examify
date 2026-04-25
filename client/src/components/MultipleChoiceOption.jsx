export default function MultipleChoiceOption({ index, id, option, handleAnswer, isDisabled, isSelected, isCorrectAnswer }) {
    const cursorClass = isDisabled ? "cursor-default" : "cursor-pointer";
    const optionStyling = isSelected ?
        isCorrectAnswer ?
            "border-green-600 bg-green-50 text-green-900" :
            "border-red-600 bg-red-50 text-red-900"
        : "border-gray-300";

    return (
        <div className={`flex border-1 p-1.5 rounded-lg ${optionStyling}`}>
            <input disabled={isDisabled} onChange={handleAnswer} type="radio" id={`${id} - ${index}`} name={id} checked={isSelected} className={cursorClass} />
            <label htmlFor={`${id} - ${index}`} className={`font-medium flex-1 ${cursorClass} ml-3`}>{option}</label>
        </div>
    )
}