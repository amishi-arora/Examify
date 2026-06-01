import ErrorMessage from "./ErrorMessage"
export default function ExamSettings({ settings, updateSettings }) {
    const noQuestionTypesSelected =
        (settings.shortAnswer === "0" || settings.shortAnswer === "") &&
        (settings.multipleChoice === "0" || settings.multipleChoice === "");
    function handleCountChange(setting, value) {
        if (Number(value) >= 0 && Number(value) <= 10) {
            updateSettings(setting, value);
        }
    }

    return <form className="flex flex-col text-gray-600 text-sm gap-2 mt-5">
        <label htmlFor="difficulty">Difficulty</label>
        <select onChange={(e) => updateSettings("difficulty", e.target.value)} value={settings.difficulty} className="p-1.5 rounded-lg border-gray-300 cursor-pointer border" name="difficulty" id="difficulty">
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Mixed">Mixed</option>
        </select>

        <label>Question types</label>
        <div className="flex items-center justify-between p-1 rounded-lg border-gray-300 border">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input onChange={(e) => updateSettings("multipleChoice", e.target.checked ? "5" : "0")} checked={settings.multipleChoice !== '0' && settings.multipleChoice !== ""} type="checkbox" className="accent-blue-600" />
                Multiple Choice
            </label>
            <input
                onChange={(e) => handleCountChange("multipleChoice", e.target.value)}
                type="number"
                min="0"
                max="10"
                value={settings.multipleChoice}
                className="border border-gray-300 rounded-lg w-14 p-1 text-center focus:border-blue-400"
            />
        </div>

        <div className="flex items-center justify-between p-1 rounded-lg border-gray-300 border">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input onChange={(e) => updateSettings("shortAnswer", e.target.checked ? "5" : "0")} checked={settings.shortAnswer !== '0' && settings.shortAnswer !== ""} type="checkbox" className="accent-blue-600" />
                Short Answer
            </label>
            <input
                onChange={(e) => handleCountChange("shortAnswer", e.target.value)}
                type="number"
                min="0"
                max="10"
                value={settings.shortAnswer}
                className="border border-gray-300 rounded-lg w-14 p-1 text-center focus:border-blue-400"
            />
        </div>
        {noQuestionTypesSelected && <ErrorMessage message="Please select at least one question type" />}

        <label htmlFor="topics">Focus topics (optional)</label>
        <input onChange={(e) => updateSettings("focusTopics", e.target.value)} id="topics" className="p-1.5 rounded-lg border-gray-300 border" placeholder="e.g. mitosis, chemical reactions, etc." type="text" value={settings.focusTopics} />

        <label htmlFor="instructions">Additional instructions (optional)</label>
        <textarea onChange={(e) => updateSettings("additionalInstructions", e.target.value)} id="instructions" className="p-1.5 rounded-lg border-gray-300 border" placeholder="e.g. focus on calculation questions, avoid definitions, etc." value={settings.additionalInstructions} />
    </form>
}
