import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import ExamResultsPage from "./pages/ExamResultsPage";
import SignInPage from "./pages/SignInPage";

function App() {
  const [questions, setExamQuestions] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [examResults, setExamResults] = useState({})

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <SignInPage />
        } />
        <Route path="/home" element={
          <HomePage setExamQuestions={setExamQuestions} />
        } />
        <Route path="/exam" element={questions ?
          <ExamPage studentAnswers={examAnswers} examQuestions={questions} setExamAnswers={setExamAnswers} setExamResults={setExamResults} /> :
          <Navigate to="/home" />
        } />
        <Route path="/results" element={examResults ?
          <ExamResultsPage examQuestions={questions} examAnswers={examAnswers} examResults={examResults} /> :
          <Navigate to="/home" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
