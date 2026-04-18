export default function MultipleChoiceOption({index, option, id, onSelect, isDisabled, isSelected, isCorrect}) {
    const cursor = isDisabled? "cursor-default":"cursor-pointer"; 
    let optionStyling = "border-mist-300"; 
    if(isSelected) {
        if(isCorrect) {
            optionStyling = "border-green-600 bg-green-50 text-green-900"
        } else {
            optionStyling = "border-red-600 bg-red-50 text-red-900"
        }
    }
    return (
        <div className={`flex border-1 p-1.5 rounded-lg ${optionStyling}`}>
            <input disabled = {isDisabled} onChange = {onSelect} type="radio" id={`${id} - ${index}`} name={id} className={cursor}/>
            <label htmlFor={`${id} - ${index}`} className={`font-medium flex-1 ${cursor} ml-3`}>{option}</label>
        </div>
    )
}