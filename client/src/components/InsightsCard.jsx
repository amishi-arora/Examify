const strongTopics = ["biology", "computer science"];
const weakTopics = ["physics", "chemistry"]
export default function InsightsCard() {
    return <div className="flex flex-col gap-3 bg-white p-10 shadow-md rounded-2xl w-1/2">
        <p className="tracking-[0.05em] uppercase text-stone-400 text-sm">AI Insights</p>

        <p className="text-stone-800">You showed strong understanding of cell division and DNA replication. However, questions related to cellular respiration and ATP production were challenging — these are worth reviewing before your next exam.</p>

        <p className="text-sm text-green-900">Strong topics</p>
        <div className="flex flex-row gap-1">
            {strongTopics.map(s => <span className="rounded-xl px-2 bg-green-100 text-green-900 ease hover:scale-102 text-sm">{s}</span>)}
        </div>

        <p className="text-sm text-red-900">Needs review</p>
        <div className="flex flex-row gap-1">
            {weakTopics.map(w => <span className="rounded-xl px-2 bg-red-100 text-red-900 ease hover:scale-102 text-sm">{w}</span>)}
        </div>

        <button className="cursor-pointer bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">Regenerate exam focused on weak topics</button>
    </div>
}