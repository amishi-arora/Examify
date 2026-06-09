import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import ExamResultsPage from "./pages/ExamResultsPage";
import SignInPage from "./pages/SignInPage";

function App() {
  const token = localStorage.getItem("token");
  const [questions, setExamQuestions] = useState({});
  const [examAnswers, setExamAnswers] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <SignInPage />
        } />
        <Route path="/home" element={token ? <HomePage setExamQuestions={setExamQuestions} /> : <Navigate to="/" />} />
        <Route path="/exam" element={token && questions ?
          <ExamPage studentAnswers={examAnswers} examQuestions={questions} setExamAnswers={setExamAnswers} /> :
          <Navigate to="/home" />
        } />
        <Route path="/results" element={token ?
          <ExamResultsPage /> :
          <Navigate to="/home" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
