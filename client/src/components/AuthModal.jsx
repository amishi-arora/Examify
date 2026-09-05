import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api.js";
import ErrorMessage from "./ErrorMessage.jsx";

export default function AuthModal({setToken}) {
    const [loginMode, setLoginMode] = useState(true);
    const [error, setError] = useState(null)
    const [loggingIn, setLoggingIn] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        setError(null);
        try {
            setLoggingIn(true);
            if (loginMode) {
                const { token, name } = await login(fd.get("email"), fd.get("password"));
                localStorage.setItem("token", token);
                localStorage.setItem("name", name);
                setToken(token); 
            } else {
                if (fd.get("password") !== fd.get("confirmPassword")) {
                    setError("Passwords do not match");
                    return;
                }
                const { token, name } = await register(fd.get("name"), fd.get("email"), fd.get("password"));
                localStorage.setItem("token", token);
                localStorage.setItem("name", name);
                setToken(token); 
            }
            navigate("/home");
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoggingIn(false);
        }
    }

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-xl shadow-md p-8 w-full max-w-sm gap-5">
            <form key={loginMode} onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm text-gray-600">
                {!loginMode &&
                    <label className="flex flex-col gap-1.5">Name
                        <input
                            name="name"
                            required
                            className="border border-gray-300 rounded-lg p-2"
                            type="text"
                            placeholder="Amishi"
                        />
                    </label>
                }

                <label className="flex flex-col gap-1.5">Email
                    <input
                        name="email"
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="email"
                        placeholder="you@example.com"
                    />
                </label>

                <label className="flex flex-col gap-1.5">Password
                    <input
                        name="password"
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="password"
                        placeholder="••••••••"
                    />
                </label>

                {!loginMode &&
                    <label className="flex flex-col gap-1.5">Confirm password
                        <input
                            name="confirmPassword"
                            required
                            className="border border-gray-300 rounded-lg p-2"
                            type="password"
                            placeholder="••••••••"
                        />
                    </label>
                }

                {error && <ErrorMessage message={error} />}

                <button disabled={loggingIn} type="submit" className="cursor-pointer bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition flex items-center justify-center  disabled:bg-gray-300 disabled:cursor-default">{loginMode ?
                    loggingIn ? <span className="mx-auto animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        : loggingIn ? <span className="mx-auto animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : "Log in" : "Create account"}</button>

                <p className="text-center text-sm">{loginMode ? "Don't have an account?" : "Already have an account?"} <button className="text-blue-600 cursor-pointer" onClick={() => { setError(""); setLoginMode((prev) => !prev); }}>
                    {loginMode ? "Sign up" : "Log in"}
                </button></p>
            </form>
        </div>
    )
}
