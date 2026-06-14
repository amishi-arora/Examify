import { useNavigate } from "react-router-dom"
export default function BackButton({ label, to }) {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(to)} className="cursor-pointer text-blue-500 hover:text-blue-800 transition text-sm" > {label}</ button>
    )

}