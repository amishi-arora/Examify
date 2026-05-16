import { useState } from "react";
export default function AuthModal() {
    const [signUp, setSignUp] = useState(true);
    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-xl shadow-md p-8 w-full max-w-sm gap-5">
            <form className="flex flex-col gap-4 text-sm text-gray-600">
                {!signUp && <div className="flex flex-col gap-1.5">
                    <label>Name</label>
                    <input
                        required 
                        className="border border-gray-300 rounded-lg p-2"
                        type="text"
                        placeholder="Amishi"
                    />
                </div>}

                <div className="flex flex-col gap-1.5">
                    <label>Email</label>
                    <input
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="email"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label>Password</label>
                    <input
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="password"
                        placeholder="••••••••"
                    />
                </div>

                {!signUp && <div className="flex flex-col gap-1.5">
                    <label>Confirm password</label>
                    <input
                        required
                        className="border border-gray-300 rounded-lg p-2"
                        type="password"
                        placeholder="••••••••"
                    />
                </div>}
            </form>
            <button className="cursor-pointer bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">{signUp ? "Log in" : "Create account"}</button>
            <p className="text-center text-sm">{signUp ? "Don't have an account?" : "Already have an account?"} <button className="text-blue-600 cursor-pointer" onClick={() => setSignUp((prev) => !prev)}>
                {signUp ? "Sign up" : "Log in"}
            </button></p>
        </div>
    )
}