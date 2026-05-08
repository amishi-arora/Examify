export default function ExamSettings() {
    return <form className="flex flex-col text-gray-600 text-sm gap-2 mt-5" action="">
        <label className="" htmlFor="difficulty ">Difficulty</label>
        <select className="border-1 p-1.5 rounded-lg border-gray-300" name="difficulty" id="difficulty">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
            <option value="mixed">Mixed</option>
        </select>

        <label className="" htmlFor="types ">Question Types</label>
        <div className="flex items-center justify-between p-1 rounded-lg border-1 border-gray-300">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input defaultChecked type="checkbox" className="accent-blue-500" />
                Multiple Choice
            </label>
            <input
                type="number"
                min="0"
                max="20"
                defaultValue={5}
                className="border border-gray-300 rounded-lg w-14 p-1 text-sm text-center focus:outline-none focus:border-blue-400"
            />
        </div>

        <div className="flex items-center justify-between p-1 rounded-lg border-1 border-gray-300">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input defaultChecked type="checkbox" className="accent-blue-500" />
                Short Answer
            </label>
            <input
                type="number"
                min="0"
                max="20"
                defaultValue={5}
                className="border border-gray-300 rounded-lg w-14 p-1 text-sm text-center focus:outline-none focus:border-blue-400"
            />
        </div>

        <label className="" htmlFor="topics">Focus topics (optional)</label>
        <input className="border-1 p-1.5 rounded-lg border-gray-300" placeholder="e.g. mitosis, chemical reactions, etc." type="text" />

        <label className="" htmlFor="instructions">Additional Instructions (optional)</label>
        <textarea className="border-1 p-1.5 rounded-lg border-gray-300" placeholder="e.g. provide calculation questions, avoid calculation questions, etc." type="text" />
    </form>
}