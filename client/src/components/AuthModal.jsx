import { useState } from "react";
import { login, register } from "../api.js";
import ErrorMessage from "./ErrorMessage.jsx";
import { useNavigate } from "react-router-dom";

export default function AuthModal() {
    const [loginMode, setLoginMode] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    async function handleSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        try {
            if (loginMode) {
                const { token, name } = await login(fd.get("email"), fd.get("password"));
                localStorage.setItem("token", token);
                localStorage.setItem("name", name);
            } else {
                if(fd.get("password") !== fd.get("confirmPassword")) {
                    setError("Password do not match"); 
                    return; 
                }
                const { token, name } = await register(fd.get("name"), fd.get("email"), fd.get("password"));
                localStorage.setItem("token", token);
                localStorage.setItem("name", name);
            }
            navigate("/home");
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-xl shadow-md p-8 w-full max-w-sm gap-5">
            <form key={loginMode} onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm text-gray-600">
                {!loginMode && <div className="flex flex-col gap-1.5">
                    <label>Name</label>
                    <input
                        name="name"
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="text"
                        placeholder="Amishi"
                    />
                </div>}

                <div className="flex flex-col gap-1.5">
                    <label>Email</label>
                    <input
                        name="email"
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="email"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label>Password</label>
                    <input
                        name="password"
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="password"
                        placeholder="••••••••"
                    />
                </div>

                {!loginMode && <div className="flex flex-col gap-1.5">
                    <label>Confirm password</label>
                    <input
                        name="confirmPassword"
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="password"
                        placeholder="••••••••"
                    />
                </div>}
                <ErrorMessage message = {error}/>
                <button type="submit" className="cursor-pointer bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">{loginMode ? "Log in" : "Create account"}</button>
                <p className="text-center text-sm">{loginMode ? "Don't have an account?" : "Already have an account?"} <button className="text-blue-600 cursor-pointer" onClick={() => {setError(""); setLoginMode((prev) => !prev);}}>
                    {loginMode ? "Sign up" : "Log in"}
                </button></p>
            </form>
        </div>
    )
}
