import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import ExamResultsPage from "./pages/ExamResultsPage";

function App() {
  const [questions, setQuestions] = useState({ questions: [] });
  const [examAnswers, setExamAnswers] = useState({}); 
  const [examResults, setExamResults] = useState({}); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <HomePage setQuestions={setQuestions} />
        } />
        <Route path="/exam" element={
          <ExamPage answers = {examAnswers} updateAnswers = {setExamAnswers} updateResults = {setExamResults} examQuestions={questions} />
        } />
        <Route path="/results" element={
          <ExamResultsPage examQuestions={questions} examAnswers = {examAnswers} examResults={examResults}/>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
