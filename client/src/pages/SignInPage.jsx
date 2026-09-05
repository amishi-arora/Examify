import AuthModal from "../components/AuthModal";
import Header from "../components/Header";
export default function SignInPage({setToken}) {
    return (
        <main className="flex flex-col min-h-screen bg-stone-50 p-15 items-center justify-center gap-10">
            <Header title="Examify" subtitle="Study for your next exam with ease" />
            <AuthModal setToken={setToken}/>
        </main>
    )
}