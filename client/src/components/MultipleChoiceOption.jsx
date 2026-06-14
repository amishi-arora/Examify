import * as constants from "../constants.js"

export default function MultipleChoiceOption({ index, id, option, handleAnswer, isDisabled, isSelected, isCorrectAnswer }) {
    const cursorClass = isDisabled ? "cursor-default" : "cursor-pointer";
    const optionStyling = isSelected ?
        isCorrectAnswer ?
            constants.SCORE_COLORS.HIGH.full :
            constants.SCORE_COLORS.LOW.full
        : "border-gray-300";

    return (
        <div className={`flex border-1 p-1.5 rounded-lg ${optionStyling}`}>
            <input disabled={isDisabled} onChange={handleAnswer} type="radio" id={`${id} - ${index}`} name={id} checked={isSelected} className={cursorClass} />
            <label htmlFor={`${id} - ${index}`} className={`font-medium flex-1 ${cursorClass} ml-3`}>{option}</label>
        </div>
    )
}