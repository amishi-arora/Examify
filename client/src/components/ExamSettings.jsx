export default function ExamSettings() {
    return <form className="flex flex-col text-gray-600 text-sm gap-2 mt-5">
        <label htmlFor="difficulty">Difficulty</label>
        <select defaultValue="medium" className="p-1.5 rounded-lg border-gray-300 cursor-pointer border" name="difficulty" id="difficulty">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="mixed">Mixed</option>
        </select>

        <label>Question types</label>
        <div className="flex items-center justify-between p-1 rounded-lg border-gray-300 border">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input defaultChecked type="checkbox" className="accent-blue-500" />
                Multiple Choice
            </label>
            <input
                type="number"
                min="0"
                max="10"
                defaultValue={5}
                className="border border-gray-300 rounded-lg w-14 p-1 text-center focus:border-blue-400"
            />
        </div>

        <div className="flex items-center justify-between p-1 rounded-lg border-gray-300 border">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input defaultChecked type="checkbox" className="accent-blue-500" />
                Short Answer
            </label>
            <input
                type="number"
                min="0"
                max="10"
                defaultValue={5}
                className="border border-gray-300 rounded-lg w-14 p-1 text-center focus:border-blue-400"
            />
        </div>

        <label htmlFor="topics">Focus topics (optional)</label>
        <input id="topics" className="p-1.5 rounded-lg border-gray-300 border" placeholder="e.g. mitosis, chemical reactions, etc." type="text" />

        <label htmlFor="instructions">Additional instructions (optional)</label>
        <textarea id="instructions" className="p-1.5 rounded-lg border-gray-300 border" placeholder="e.g. focus on calculation questions, avoid definitions, etc."/>
    </form>
}
