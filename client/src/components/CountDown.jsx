import { useState, useEffect } from "react";
export default function CountDown({ time, onTimeout }) {
    const [remainingTime, setRemainingTime] = useState(time * 60);

    useEffect(() => {
        if (remainingTime == 0) {
            onTimeout();
            return;
        }
        const timer = setTimeout(() => {
            setRemainingTime(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [remainingTime]);

    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;

    return (
        <div className="flex flex-col gap-3 w-full justify-center items-center">
            <i class="fa-regular fa-clock"></i>
            <p className="text-2xl font-bold">{mins}:{secs.toString().padStart(2, '0')}</p>
            <p className="text-sm">remaining</p>
        </div>
    )
}
