import ErrorMessage from "./ErrorMessage"

export default function ExamSettings({ settings, updateSettings, noQuestionTypesSelected }) {

    function handleCountChange(setting, value) {
        const num = Number(value);
        if (num >= 0 && num <= 10) {
            updateSettings(setting, value);
        }
    }

    return <form className="flex flex-col text-gray-600 text-sm gap-2 mt-5">

        {/* Exam difficulty setting */}
        <label className="flex flex-col gap-1">
            Difficulty
            <select onChange={(e) => updateSettings("difficulty", e.target.value)} value={settings.difficulty} className="p-1.5 rounded-lg border-gray-300 cursor-pointer border">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
            </select>
        </label>

        {/* Exam question types settings */}
        <p>Question types</p>
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
        
        {/* Error message if no question types are selected */}
        {noQuestionTypesSelected && <ErrorMessage message="Please select at least one question type" />}

        <p>Timed exam</p>
        <div className="flex items-center justify-between p-1 rounded-lg border-gray-300 border">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input onChange={(e) => updateSettings("time", e.target.checked ? "30" : "0")} checked={settings.time !== '0' && settings.time !== ""} type="checkbox" className="accent-blue-600" />
                Timed
            </label>
            <div className="flex items-center gap-2">
                <input
                    onChange={(e) => updateSettings("time", e.target.value)}
                    type="number"
                    min="0"
                    max="10"
                    value={settings.time}
                    className="w-min p-0 text-center focus:border-blue-400 border border-gray-300 rounded-lg p-1"
                />
                <span>mins</span>
            </div>
        </div>

        {/* Exam focus topics */}
        <label className="flex flex-col gap-1">Focus topics (optional)
            <input onChange={(e) => updateSettings("focusTopics", e.target.value)} className="p-1.5 rounded-lg border-gray-300 border" placeholder="e.g. mitosis, chemical reactions, etc." type="text" value={settings.focusTopics} />
        </label>

        {/* Exam additional instructions */}
        <label className="flex flex-col gap-1">Additional instructions (optional)
            <textarea onChange={(e) => updateSettings("additionalInstructions", e.target.value)} className="p-1.5 rounded-lg border-gray-300 border" placeholder="e.g. focus on calculation questions, avoid definitions, etc." value={settings.additionalInstructions} />
        </label>
    </form>
}
