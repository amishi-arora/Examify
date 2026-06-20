export default function ProgressBar({ questions, answered }) {
    const size = 150;
    const stroke = 7;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = answered / questions
    const offset = circumference - (progress) * circumference;
    return (
        <div className="flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke="blue"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-300 ease-out"
                />
            </svg>
            <p className="text-sm text-center absolute font-semibold text-gray-700">
                {answered} / {questions} completed
            </p>
        </div>

    )
}