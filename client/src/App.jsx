import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import ExamResultsPage from "./pages/ExamResultsPage";
import SignInPage from "./pages/SignInPage";

// Function to ensure token exists and isn't expired 
function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
function App() {
  const token = localStorage.getItem("token");
  const [examQuestions, setExamQuestions] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <SignInPage />
        } />
        <Route path="/home" element={isTokenValid(token) ? <HomePage setExamQuestions={setExamQuestions} /> : <Navigate to="/" />} />
        <Route path="/exam" element={isTokenValid(token) && Object.keys(examQuestions).length ?
          <ExamPage exam={examQuestions} /> :
          <Navigate to="/home" />
        } />
        <Route path="/results" element={isTokenValid(token) ?
          <ExamResultsPage setExamQuestions={setExamQuestions} /> :
          <Navigate to="/home" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
