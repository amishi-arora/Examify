import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import ExamResultsPage from "./pages/ExamResultsPage";

function App() {
  const [questions, setExamQuestions] = useState(null);
  const [examAnswers, setExamAnswers] = useState(null); 
  const [examResults, setExamResults] = useState(null) 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <HomePage setExamQuestions={setExamQuestions} />
        } />
        <Route path="/exam" element={
          <ExamPage studentAnswers = {examAnswers} examQuestions={questions}  setExamAnswers = {setExamAnswers} setExamResults = {setExamResults}/>
        } />
        <Route path="/results" element={
          <ExamResultsPage examQuestions={questions} examAnswers = {examAnswers} examResults={examResults}/>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
