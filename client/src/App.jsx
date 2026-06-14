import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import ExamResultsPage from "./pages/ExamResultsPage";
import SignInPage from "./pages/SignInPage";

function App() {
  const token = localStorage.getItem("token");
  const [examQuestions, setExamQuestions] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <SignInPage />
        } />
        <Route path="/home" element={token ? <HomePage setExamQuestions={setExamQuestions} /> : <Navigate to="/" />} />
        <Route path="/exam" element={token && Object.keys(examQuestions).length ?
          <ExamPage examQuestions={examQuestions} /> :
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
