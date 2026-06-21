export default function InsightsCard({ insights }) {
    return <div className="flex flex-col gap-3 bg-white p-6 shadow-md rounded-2xl w-1/2">
        <p className="tracking-[0.05em] uppercase text-stone-400 text-sm">✨ AI Insights</p>

        <p className="text-stone-800">{insights.feedback}</p>

        <p className="text-sm text-green-900">Strong topics</p>
        <div className="flex flex-row gap-1">
            {insights.strongTopics?.map(s => <span key={s} className="rounded-xl px-2 bg-green-100 text-green-900 ease hover:scale-102 text-sm">{s}</span>)}
        </div>

        <p className="text-sm text-red-900">Needs review</p>
        <div className="flex flex-row gap-1">
            {insights.weakTopics?.map(w => <span key={w} className="rounded-xl px-2 bg-red-100 text-red-900 ease hover:scale-102 text-sm">{w}</span>)}
        </div>
    </div>

}